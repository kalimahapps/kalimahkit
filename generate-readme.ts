/*
* This script generates a markdown file with a list of extensions from the package.json file.
* It will output the markdown to the console. Copy and paste the output to the README.md file.
* To run this script,
* `npm install`
* `npm run generate-readme`
*/
import { extensionPack } from './package.json';
import metaFetcher from 'meta-fetcher';
import { createProgressBar, createHeader } from '@kalimahapps/cli-progress';

type Data = {
	link: string;
	title: string
	description: string;
};
const itemMarkdown = (data: Data) => {
	const { link, title, description } = data;
	return `- **[${title}](${link})**: ${description}`;
};

const markdown = ['## Extensions'];
createHeader('Generating Readme');
const progress = createProgressBar();
progress.setTotal(extensionPack.length);

const baseUrl = 'https://marketplace.visualstudio.com/items?itemName=';

for (const item of extensionPack) {
	const itemUrl = `${baseUrl}${item}`;
	const { metadata } = await metaFetcher(itemUrl);
	progress.increment();

	// if still no description, throw an error
	if (!metadata.description){
		throw new Error(`No description found for ${item}`);
	}

	// Clean up metadata
	const description = metadata.description.replace('Extension for Visual Studio Code - ', '');
	const title = metadata.title.trim().replace(' - Visual Studio Marketplace', '');
	markdown.push(itemMarkdown({
		link: itemUrl,
		description,
		title,
	}));
}
progress.stop();

console.log(markdown.join('\n'));
