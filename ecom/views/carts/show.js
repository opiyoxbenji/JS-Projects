const layout = require('../layout');

module.exports = ({ items }) => {
	// Map over the items array and create a string for each item
	const renderedItems = items
		.map(item => {
			// Create a string with the title and price of the item
			return `
      <div>${item.product.title} - ${item.product.price}</div>
    `;
		})
		.join('');

	// Return a layout object with a content property that contains an h1 element with the text "Cart" and the rendered items

	return layout({
		content: `
      <h1>Cart</h1>
      ${renderedItems}
    `,
	});
};
