## Motivation
There are [worries](https://cybernews.com/editorial/chatgpt-decay-critical-thinking/) that LLMs such as ChatGPT hinder our critical thinking skill. But hey! don't be cynical. Let's turn it around and practice the skills with its help! 

Whenever you encounter some texts on the Internet, ask ChatGPT to construct and assess the argument. Challenge it if you don't agree! 

## Features
Argue-About-Everything is a Chrome extension that:
1. Summarizes **any** selected text into a form of an argument if possible - it provides premises and conclusion, as well as the credibilities of the premises, the assessment of the argument, and suggestions for further reading. 
2. Provides reasons if the text cannot be analyzed in the form of an argument - it might be lyric, poem, tweet, etc.
3. Defends users' challenges against the argument it made.


## Installation
1. Clone or download this repo.
2. Obtain an openai api key. You may refer [here](https://www.windowscentral.com/software-apps/how-to-get-an-openai-api-key). **WARNING: DO NOT SHARE IT**
3. Replace <OPENAI_API_KEY> in src/credentials.js with the key obtained in step 2.
4. Enter chrome://extensions/ in chrome's URL bar
5. Click "load unpacked" and select /src


## Usage
1. Select the text to be analyzed.
2. Click on the extension Icon.
3. Click on the premises, credibilities, conclusion, assessment to "challenge" ChatGPT. Click on related resource to jump to the related pages. 


### Sample pages to test out
1. Turing Test in Stanford Encyclopedia of Philosophy: <https://plato.stanford.edu/entries/turing-test/>
2. William Shakespeare Sonnet 18: <https://www.poetryfoundation.org/poems/45087/sonnet-18-shall-i-compare-thee-to-a-summers-day>


### Technical Highlights:
1. The json payload to render was instructed in the prompt. 
2. ChatGPT handles the conversation context as a list in the API. In client side that list can be elegantly stored in session store. The context enables the "challange and defend" feature. 


Icons created by [juicy_fish - Flaticon](https://www.flaticon.com/free-icons/philosophy)