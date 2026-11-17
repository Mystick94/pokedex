const pokemonName = document.querySelector('.pokemon_name');
const pokemonNumber = document.querySelector('.pokemon_number');
const pokemonImage = document.querySelector('.pokemon_image');

const form = document.querySelector('.form');
const input = document.querySelector('.input_search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;
let isLoading = false;

const fetchPokemon = async (pokemon) => {
    try {
        const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        if (APIResponse.status === 200) {
            return await APIResponse.json();
        }
    } catch (error) {
        // Network failure: fall through to the "not found" state
    }
};

const getSprite = (data) => {
    // Animated black-white sprites only exist up to generation V (#649)
    const animated =
        data.sprites.versions['generation-v']['black-white'].animated.front_default;
    return animated || data.sprites.front_default;
};

const renderPokemon = async (pokemon) => {
    if (isLoading) return;
    isLoading = true;
    buttonPrev.disabled = true;
    buttonNext.disabled = true;

    pokemonName.textContent = 'Loading...';
    pokemonNumber.textContent = '';

    const data = await fetchPokemon(pokemon);
    if (data) {
        pokemonImage.style.display = 'block';
        pokemonName.textContent = data.name;
        pokemonNumber.textContent = data.id;
        pokemonImage.src = getSprite(data);
        input.value = '';
        searchPokemon = data.id;
    } else {
        pokemonImage.style.display = 'none';
        pokemonName.textContent = 'Not found :c';
        pokemonNumber.textContent = '';
    }

    isLoading = false;
    buttonPrev.disabled = false;
    buttonNext.disabled = false;
};

form.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.trim().toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        renderPokemon(searchPokemon - 1);
    }
});

buttonNext.addEventListener('click', () => {
    renderPokemon(searchPokemon + 1);
});

renderPokemon(searchPokemon);
