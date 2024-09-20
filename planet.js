import * as THREE from 'https://unpkg.com/three@0.168.0/build/three.module.js';

const startPage = document.getElementById('startPage');
const simulationPage = document.getElementById('simulationPage');
const endPage = document.getElementById('endPage');
const questionText = document.getElementById('questionText');
const choicesDiv = document.getElementById('choices');
const factText = document.getElementById('factText');
const planetStatsDiv = document.getElementById('planetStats');
const planetNameInput = document.getElementById('planetName');
const descriptionDiv = document.getElementById('description');
const planetNameDisplay = document.createElement('p'); // Element to show the name next to the planet
planetNameDisplay.id = "planetNameDisplay";
const startButton = document.getElementById('startButton');
const submitNameButton = document.getElementById('submitNameButton');
const newSimulationButton = document.getElementById('newSimulationButton');
const planetContainer = document.getElementById('planetContainer');
const finalPlanetContainer = document.getElementById('finalPlanetContainer');

let planetRadius = 130;
let waterLevel = 50;
let atmosphereColor = 0xFFFFFF;
let volcanicActivity = "None";
let lifePossibility = 0;
let starColor = 0xFFFFAA;
let textureFolder = 'rocky';
let lights = [];
let finalLights = [];
let atmosphereOpacity = 0.01;
const initialCameraZ = 3;

const questions = [
    {
        question: "Select the surface type of your planet:",
        options: ["Rocky", "Icy", "Ocean", "Gas Giant", "Custom"],
        fact: "Surface type determines the planet's geology and potential habitability.",
        onSelect: handleSurfaceTypeChoice
    },
    {
        question: "Select the size of your planet:",
        options: ["Small (Mars-sized)", "Medium (Earth-sized)", "Large (Super-Earth)"],
        fact: "Larger planets can hold more atmosphere, but may become gas giants if too large.",
        onSelect: handlePlanetSizeChoice
    },
    {
        question: "Choose the distance from the star:",
        options: ["Close (Hot)", "Habitable Zone", "Far (Cold)"],
        fact: "The habitable zone is the range where liquid water can exist on the surface.",
        onSelect: handleDistanceChoice
    },
    {
        question: "What is the composition of your atmosphere?",
        options: ["Thick (high CO2)", "Thin (low CO2)", "Balanced (Nitrogen-Oxygen)"],
        fact: "A balanced atmosphere with oxygen and nitrogen can support complex life.",
        onSelect: handleAtmosphereChoice
    },
    {
        question: "Choose the water coverage on your planet:",
        options: ["Dry", "Some Water", "Oceans"],
        fact: "Liquid water is essential for all known life forms.",
        onSelect: handleWaterChoice
    },
    {
        question: "Does your planet have volcanic activity?",
        options: ["None", "Moderate", "High"],
        fact: "Volcanic activity can release gases and help form an atmosphere.",
        onSelect: handleVolcanicChoice
    },
    {
        question: "Does your planet have a magnetic field?",
        options: ["Yes", "No"],
        fact: "A magnetic field protects a planet's atmosphere from solar wind.",
        onSelect: handleMagneticFieldChoice
    },
    {
        question: "What type of star does your planet orbit?",
        options: ["Red Dwarf", "Yellow Dwarf (like our Sun)", "Blue Giant"],
        fact: "The type of star affects the light and heat the planet receives.",
        onSelect: handleStarTypeChoice
    }
];

let currentQuestionIndex = 0;
let scene, camera, renderer, planetMesh, atmosphereMesh;
let waterLayer, sunLight;
let isAnimating = true;
let finalScene, finalCamera, finalRenderer, finalPlanetMesh, finalAtmosphereMesh;
let isFinalAnimating = true;

startButton.addEventListener('click', showSimulationPage);
submitNameButton.addEventListener('click', submitPlanetName);
newSimulationButton.addEventListener('click', startNewSimulation);

let planetGeometry = new THREE.SphereGeometry(5, 32, 32);

function generatePlanetWithWater(geometry, waterLevel = 0.3) {
    let noise = new SimplexNoise();
    geometry.vertices.forEach(vertex => {
        let elevation = noise.noise(vertex.x * 0.5, vertex.y * 0.5, vertex.z * 0.5);
        vertex.multiplyScalar(1 + elevation * 0.1);
        if (elevation < waterLevel) {
            vertex.color = new THREE.Color(0x3498db);
        } else {
            vertex.color = new THREE.Color(0x8b4513);
        }
    });
    geometry.colorsNeedUpdate = true;
    geometry.verticesNeedUpdate = true;
}

function createWaterLayer() {
    const waterMaterial = new THREE.MeshPhongMaterial({
        color: 0x1f8ef1,
        shininess: 100,
        transparent: true,
        opacity: 0.6
    });
    waterLayer = new THREE.Mesh(planetGeometry, waterMaterial);
    waterLayer.scale.set(1.01, 1.01, 1.01);
    scene.add(waterLayer);
}

function addSunReflection() {
    sunLight = new THREE.DirectionalLight(0xffffff, 1);
    sunLight.position.set(50, 50, 50);
    scene.add(sunLight);
    planetMesh.material.shininess = 30;
    waterLayer.material.shininess = 100;
}

generatePlanetWithWater(planetGeometry);

function showSimulationPage() {
    startPage.classList.add('hidden');
    simulationPage.classList.remove('hidden');
    showQuestion();
    init3DScene();
}

function init3DScene() {
    scene = new THREE.Scene();
    const aspectRatio = planetContainer.clientWidth / planetContainer.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    camera.position.z = initialCameraZ;
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(planetContainer.clientWidth, planetContainer.clientWidth);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.gammaFactor = 2.2;
    planetContainer.appendChild(renderer.domElement);
    loadPlanetTextures();
    loadAtmosphere();
    createWaterLayer();
    addSunReflection();
    updatePlanet();
    isAnimating = true;
    animate();
}

function loadPlanetTextures() {
    const textureLoader = new THREE.TextureLoader();
    const surfaceTexturePath = `textures/${textureFolder}/diffuse.jpg`;
    const bumpTexturePath = `textures/${textureFolder}/bump.jpg`;
    const specularTexturePath = `textures/${textureFolder}/specular.jpg`;
    const planetTexture = textureLoader.load(surfaceTexturePath);
    planetTexture.encoding = THREE.sRGBEncoding;
    const bumpTexture = textureLoader.load(bumpTexturePath);
    bumpTexture.encoding = THREE.sRGBEncoding;
    const materialOptions = {
        map: planetTexture,
        bumpMap: bumpTexture,
        bumpScale: 0.05,
        shininess: 50
    };
    if (specularTexturePath) {
        const specularTexture = textureLoader.load(specularTexturePath);
        specularTexture.encoding = THREE.sRGBEncoding;
        materialOptions.specularMap = specularTexture;
    }
    const material = new THREE.MeshPhongMaterial(materialOptions);
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    if (planetMesh) scene.remove(planetMesh);
    planetMesh = new THREE.Mesh(geometry, material);
    scene.add(planetMesh);
    loadAtmosphere();
    addLighting();
}

function loadAtmosphere() {
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: atmosphereColor,
        transparent: true,
        opacity: atmosphereOpacity,
        side: THREE.DoubleSide,
    });
    if (atmosphereMesh) {
        planetMesh.remove(atmosphereMesh);
        atmosphereMesh.material.dispose();
        atmosphereMesh.geometry.dispose();
    }
    atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    planetMesh.add(atmosphereMesh);
}

function addLighting() {
    scene.children = scene.children.filter(child => !(child instanceof THREE.Light));
    lights = [];
    const lightPositions = [
        [-5, 5, 5],
        [5, 5, 5],
        [-5, -5, 5],
        [5, -5, 5]
    ];
    lightPositions.forEach(pos => {
        const light = new THREE.PointLight(starColor, 2.5, 100);
        light.position.set(pos[0], pos[1], pos[2]);
        scene.add(light);
        lights.push(light);
    });
    const directionalLight = new THREE.DirectionalLight(starColor, 1.5);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0x666666);
    scene.add(ambientLight);
}

function animate() {
    if (!isAnimating) return;
    requestAnimationFrame(animate);
    planetMesh.rotation.y += 0.001;
    waterLayer.rotation.y += 0.001;
    renderer.render(scene, camera);
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    questionText.textContent = question.question;
    factText.textContent = question.fact;
    choicesDiv.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'choice-btn';
        button.onclick = () => handleChoice(index);
        choicesDiv.appendChild(button);
    });
}

function handleChoice(choiceIndex) {
    const question = questions[currentQuestionIndex];
    question.onSelect(choiceIndex);
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endSimulation();
    }
    updatePlanet();
}

function updatePlanet() {
    const scale = planetRadius / 150;
    planetMesh.scale.set(scale, scale, scale);
    adjustCameraPosition(scale);
    loadPlanetTextures();
    planetMesh.material.needsUpdate = true;
    if (atmosphereMesh && atmosphereMesh.material) {
        atmosphereMesh.material.needsUpdate = true;
    }
}

function adjustCameraPosition(scale) {
    const newCameraZ = initialCameraZ / scale;
    camera.position.z = newCameraZ;
    camera.updateProjectionMatrix();
}

function handleSurfaceTypeChoice(choiceIndex) {
    const surfaces = ["rocky", "icy", "ocean", "gas", "custom"];
    textureFolder = surfaces[choiceIndex];
    if (choiceIndex === 0) lifePossibility += 20;
    else if (choiceIndex === 1) lifePossibility -= 10;
    else if (choiceIndex === 2) lifePossibility += 40;
    else if (choiceIndex === 4) lifePossibility += 10;
    else lifePossibility -= 50;
}

function handlePlanetSizeChoice(choiceIndex) {
    if (choiceIndex === 0) planetRadius = 50;
    else if (choiceIndex === 1) planetRadius = 100;
    else planetRadius = 150;
}

function handleDistanceChoice(choiceIndex) {
    if (choiceIndex === 0) lifePossibility -= 20;
    else if (choiceIndex === 1) lifePossibility += 50;
    else lifePossibility -= 30;
}

function handleAtmosphereChoice(choiceIndex) {
    if (choiceIndex === 0) {
        atmosphereColor = 0xFF4500;
        atmosphereOpacity = 0.5;
    } else if (choiceIndex === 1) {
        atmosphereColor = 0x87CEFA;
        atmosphereOpacity = 0.3;
    } else {
        atmosphereColor = 0xADD8E6;
        atmosphereOpacity = 0.4;
    }
    loadAtmosphere();
}

function handleWaterChoice(choiceIndex) {
    if (choiceIndex === 0) waterLevel = 10;
    else if (choiceIndex === 1) waterLevel = 50;
    else waterLevel = 90;
}

function handleVolcanicChoice(choiceIndex) {
    if (choiceIndex === 0) volcanicActivity = "None";
    else if (choiceIndex === 1) volcanicActivity = "Moderate";
    else volcanicActivity = "High";
}

function handleMagneticFieldChoice(choiceIndex) {
    if (choiceIndex === 0) lifePossibility += 30;
    else lifePossibility -= 20;
}

function handleStarTypeChoice(choiceIndex) {
    if (choiceIndex === 0) {
        starColor = 0xFF4500;
        lifePossibility -= 10;
    } else if (choiceIndex === 1) {
        starColor = 0xFFFFAA;
        lifePossibility += 10;
    } else {
        starColor = 0x99CCFF;
        lifePossibility -= 20;
    }
    addLighting();
}

function endSimulation() {
    simulationPage.classList.add('hidden');
    endPage.classList.remove('hidden');
    initFinal3DScene();
    planetStatsDiv.innerHTML = `
        <p><strong>Planet Size:</strong> ${planetRadius === 50 ? "Small (Mars-sized)" : planetRadius === 100 ? "Medium (Earth-sized)" : "Large (Super-Earth)"}</p>
        <p><strong>Water Level:</strong> ${waterLevel}%</p>
        <p><strong>Atmosphere:</strong> ${atmosphereColor === 0xFF4500 ? "Thick" : atmosphereColor === 0x87CEFA ? "Thin" : "Balanced"}</p>
        <p><strong>Volcanic Activity:</strong> ${volcanicActivity}</p>
        <p><strong>Life Possibility:</strong> ${lifePossibility}%</p>
        <p><strong>Possible Life Forms:</strong> ${lifePossibility > 50 ? "Microbial Life, Complex Life" : "Only Extremophiles"}</p>
    `;
    finalPlanetContainer.appendChild(planetNameDisplay); // Attach the name display to the container
}

function initFinal3DScene() {
    finalScene = new THREE.Scene();
    const aspectRatio = finalPlanetContainer.clientWidth / finalPlanetContainer.clientHeight;
    finalCamera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    finalCamera.position.z = initialCameraZ;
    finalRenderer = new THREE.WebGLRenderer({ antialias: true });
    finalRenderer.setSize(finalPlanetContainer.clientWidth, finalPlanetContainer.clientHeight);
    finalRenderer.setClearColor(0x000000, 0);
    finalRenderer.outputEncoding = THREE.sRGBEncoding;
    finalRenderer.gammaFactor = 2.2;
    finalPlanetContainer.appendChild(finalRenderer.domElement);
    loadFinalPlanetTextures();
    loadFinalAtmosphere();
    addFinalLighting();
    isFinalAnimating = true;
    animateFinalPlanet();
}

function loadFinalPlanetTextures() {
    const textureLoader = new THREE.TextureLoader();
    const surfaceTexturePath = `textures/${textureFolder}/diffuse.jpg`;
    const bumpTexturePath = `textures/${textureFolder}/bump.jpg`;
    const specularTexturePath = `textures/${textureFolder}/specular.jpg`;
    const planetTexture = textureLoader.load(surfaceTexturePath);
    planetTexture.encoding = THREE.sRGBEncoding;
    const bumpTexture = textureLoader.load(bumpTexturePath);
    bumpTexture.encoding = THREE.sRGBEncoding;
    const materialOptions = {
        map: planetTexture,
        bumpMap: bumpTexture,
        bumpScale: planetMesh.material.bumpScale,
        specular: planetMesh.material.specular.clone(),
        shininess: 50
    };
    if (specularTexturePath) {
        const specularTexture = textureLoader.load(specularTexturePath);
        specularTexture.encoding = THREE.sRGBEncoding;
        materialOptions.specularMap = specularTexture;
    }
    const material = new THREE.MeshPhongMaterial(materialOptions);
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    if (finalPlanetMesh) finalScene.remove(finalPlanetMesh);
    finalPlanetMesh = new THREE.Mesh(geometry, material);
    finalPlanetMesh.scale.copy(planetMesh.scale);
    finalScene.add(finalPlanetMesh);
    loadFinalAtmosphere();
}

function loadFinalAtmosphere() {
    const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
    const atmosphereMaterial = new THREE.MeshPhongMaterial({
        color: atmosphereColor,
        transparent: true,
        opacity: atmosphereOpacity,
        side: THREE.DoubleSide,
    });
    if (finalAtmosphereMesh) {
        finalPlanetMesh.remove(finalAtmosphereMesh);
        finalAtmosphereMesh.material.dispose();
        finalAtmosphereMesh.geometry.dispose();
    }
    finalAtmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    finalPlanetMesh.add(finalAtmosphereMesh);
}

function addFinalLighting() {
    finalScene.children = finalScene.children.filter(child => !(child instanceof THREE.Light));
    finalLights = [];
    const lightPositions = [
        [-5, 5, 5],
        [5, 5, 5],
        [-5, -5, 5],
        [5, -5, 5]
    ];
    lightPositions.forEach(pos => {
        const light = new THREE.PointLight(starColor, 2.5, 100);
        light.position.set(pos[0], pos[1], pos[2]);
        finalScene.add(light);
        finalLights.push(light);
    });
    const directionalLight = new THREE.DirectionalLight(starColor, 1.5);
    directionalLight.position.set(5, 5, 5);
    finalScene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0x666666);
    finalScene.add(ambientLight);
}

function animateFinalPlanet() {
    if (!isFinalAnimating) return;
    requestAnimationFrame(animateFinalPlanet);
    finalPlanetMesh.rotation.y += 0.001;
    finalRenderer.render(finalScene, finalCamera);
}

function submitPlanetName() {
    const planetName = planetNameInput.value || "Unnamed Planet";
    let description = `Congratulations! Your planet, ${planetName}, has been created. `;
    if (lifePossibility > 50) {
        description += "It has the potential to support microbial and complex life!";
    } else if (lifePossibility > 20) {
        description += "It can support extremophiles, but more complex life may not survive.";
    } else {
        description += "This planet is too harsh for most forms of life.";
    }
    descriptionDiv.innerHTML = `<p>${description}</p>`;
    planetNameDisplay.textContent = `Planet Name: ${planetName}`; // Update the planet name next to the planet
}

function startNewSimulation() {
    planetRadius = 150;
    waterLevel = 50;
    atmosphereColor = 0xFFFFFF;
    volcanicActivity = "None";
    lifePossibility = 0;
    starColor = 0xFFFFAA;
    lights = [];
    finalLights = [];
    textureFolder = 'rocky';
    currentQuestionIndex = 0;
    planetNameInput.value = "Unnamed Planet";
    descriptionDiv.innerHTML = '';
    planetStatsDiv.innerHTML = '';
    isAnimating = false;
    isFinalAnimating = false;
    if (renderer && renderer.domElement) {
        planetContainer.removeChild(renderer.domElement);
    }
    if (finalRenderer && finalRenderer.domElement) {
        finalPlanetContainer.removeChild(finalRenderer.domElement);
    }
    disposeScene(scene);
    disposeScene(finalScene);
    endPage.classList.add('hidden');
    startPage.classList.remove('hidden');
}

function disposeScene(scene) {
    if (scene) {
        while (scene.children.length > 0) {
            const object = scene.children[0];
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            scene.remove(object);
        }
    }
}
