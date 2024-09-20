import pygame
import random
from perlin_noise import PerlinNoise

# Initialize Pygame
pygame.init()

# Screen dimensions and setup
WIDTH, HEIGHT = 1000, 800
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('Cosmic Architect: The Origin of Life')

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (0, 100, 255)
GREEN = (100, 255, 100)
BROWN = (139, 69, 19)

# Fonts
font = pygame.font.SysFont(None, 48)
small_font = pygame.font.SysFont(None, 36)

# Game phases and conditions
current_phase = 0
planet_conditions = {"water": 0, "atmosphere": "None", "temperature": "None", "geology": "None"}
user_choice_made = False

# Noise generation for procedural planet creation
planet_width, planet_height = 400, 400  # Size of the planet image
noise = PerlinNoise(octaves=3)

def generate_planet_surface(water_percentage, terrain_complexity):
    """Generates a procedural planet surface with land and water using Perlin noise."""
    planet_surface = pygame.Surface((planet_width, planet_height))
    
    for y in range(planet_height):
        for x in range(planet_width):
            # Get the noise value for each pixel
            noise_value = noise([x / planet_width, y / planet_height])
            
            # Adjust noise value based on user choices (e.g., water percentage, terrain complexity)
            if noise_value > 0.1 + (water_percentage / 100):  # Land
                pygame.draw.rect(planet_surface, BROWN, pygame.Rect(x, y, 1, 1))
            else:  # Water
                pygame.draw.rect(planet_surface, BLUE, pygame.Rect(x, y, 1, 1))
    
    return planet_surface

# Create the initial planet surface (default)
planet_image = generate_planet_surface(50, 3)

# Decision-making questions and choices for each phase
questions_phase_1 = [
    ("Choose the size of your planet:", ["Small", "Medium", "Large"]),
    ("What is the composition of your atmosphere?", ["Thick atmosphere (high CO2)", "Thin atmosphere", "Balanced atmosphere"]),
    ("How far is the planet from its star?", ["Close to the star", "Moderate distance", "Far from the star"]),
    ("Does the planet have geological activity?", ["Active geology", "Dormant geology"])
]

questions_phase_2 = [
    ("Adjust the temperature of your planet:", ["-80°C to -20°C", "-10°C to 30°C", "30°C to 80°C"]),
    ("Decide the amount of water on the surface:", ["Dry", "Some water", "Oceans"]),
    ("Control the radiation level on the planet:", ["Low radiation", "Moderate radiation", "High radiation"]),
    ("Balance the presence of CHNOPS elements:", ["Limited", "Moderate", "Rich"])
]

phases = [questions_phase_1, questions_phase_2]

# Utility function to display text
def display_text(text, x, y, color=WHITE, font_size="small"):
    if font_size == "small":
        label = small_font.render(text, True, color)
    else:
        label = font.render(text, True, color)
    screen.blit(label, (x, y))

# Button Class for clickable options
class Button:
    def __init__(self, x, y, w, h, text, callback):
        self.rect = pygame.Rect(x, y, w, h)
        self.text = text
        self.callback = callback
        self.color = BLUE

    def draw(self, screen):
        pygame.draw.rect(screen, self.color, self.rect)
        display_text(self.text, self.rect.x + 20, self.rect.y + 10, WHITE)

    def is_clicked(self, pos):
        return self.rect.collidepoint(pos)

# Create buttons for each choice (added dynamically)
buttons = []

def create_buttons(options, x, y):
    global buttons
    buttons = []
    for idx, option in enumerate(options):
        button = Button(x, y + (60 * idx), 400, 50, option, lambda idx=idx: handle_player_choice(idx))
        buttons.append(button)

# Function to handle player's choice for each phase and update conditions
def handle_player_choice(player_choice):
    global current_phase, user_choice_made, planet_image

    if current_phase == 1:
        if player_choice == 1:
            planet_conditions["water"] = 80  # Oceans
        elif player_choice == 2:
            planet_conditions["water"] = 50  # Some water
        elif player_choice == 0:
            planet_conditions["water"] = 10  # Dry planet
        
        # Update the planet's appearance based on water choice
        planet_image = generate_planet_surface(planet_conditions["water"], 3)
        
    user_choice_made = True

# Main game loop
running = True
clock = pygame.time.Clock()

# Game state
question_idx = 0

while running:
    screen.fill(BLACK)

    # Display the current question and choices
    if current_phase < len(phases):
        question, options = phases[current_phase][question_idx]
        display_text(question, 50, 100)
        create_buttons(options, 100, 200)

        # Draw buttons
        for button in buttons:
            button.draw(screen)

        # Handle mouse clicks on buttons
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.MOUSEBUTTONDOWN:
                for button in buttons:
                    if button.is_clicked(pygame.mouse.get_pos()):
                        button.callback()
                        break
        if user_choice_made:
            user_choice_made = False
            question_idx += 1
            if question_idx >= len(phases[current_phase]):
                current_phase += 1
                question_idx = 0

        # Display the dynamically created planet
        screen.blit(planet_image, (600, 200))

    pygame.display.flip()
    clock.tick(30)

pygame.quit()
