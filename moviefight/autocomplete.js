// reusable autocomplete
const createAutoComplete = ({
	root,
	renderOption,
	onOptionSelect,
	inputValue, 
	fetchData,
}) => {
	root.innerHTML = `
		<label><b>Search</b></label>
		<input class="input" />
		<div class="dropdown">
			<div class="dropdown-menu">
				<div class="dropdown-content results"></div>
			</div>
		</div>
`;

	const input = root.querySelector('input');
	const dropdown = root.querySelector('.dropdown');
	const resultsWrapper = root.querySelector('.results');

	// search timeout function
	const onInput = async event => {
		const items = await fetchData(event.target.value);

		// handling empty responses
		if (!items.length) {
			dropdown.classList.remove('is-active');
			return;
		}

		// rendering items in div
		resultsWrapper.innerHTML = '';
		dropdown.classList.add('is-active');
		for (let item of items) {
			const option = document.createElement('a');
			// handling broken images
			option.classList.add('dropdown-item');
			option.innerHTML = renderOption(item);
			// handling item selection
			option.addEventListener('click', () => {
				dropdown.classList.remove('is-active');
				input.value = inputValue(item);
				onOptionSelect(item);
			});

			resultsWrapper.appendChild(option);
		}
	};

	// search input functionality
	input.addEventListener('input', debounce(onInput, 500));

	// auto close the dropdown
	root.addEventListener('click', event => {
		if (!root.contains(event.target)) {
			dropdown.classList.remove('is-active');
		}
	});
};
