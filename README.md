## Motivation
There are [worries](https://cybernews.com/editorial/chatgpt-decay-critical-thinking/) that LLMs such as ChatGPT hinder our critical thinking's skill. But hey! don't be cynical. Let's turn it around and practice our critical thinking skills with its help! 

Whenever you encounter some texts on the Internet, ask ChatGPT to construct and assess the argument. Challenge them if you don't agree! 

## Features
Argue-About-Everything is a Chrome extension that:
1. Summarizes **any** selected text in a form of an argument if possible- it provides premises and conclusion, as well as the credibilities of the premises, the assessment of it, and the suggestions for further reading. 
2. Provides the reason if the text cannot be analyzed in the form of an argument - it might be lyric, poem, tweet, etc.
3. Defends users' challenges of the argument.


## Installation
1. clone or download this repo
2. Obtain an openai api key. You may refer here. **WARNING: DO NOT SHARE IT**
3. Replace <OPENAI_API_KEY> in src/credentials.js with the key obtained in 2.
4. Type chrome://extensions/ in chrome's URL bar
5. Click "load unpacked" and select src


## Usage
1. Select the text to be analyzed
2. Click on the extension Icon
3. Click on the premises, credibilities, conclusion, assessment to "challenge" ChatGPT. Click on Related resource to jump to the related pages. 

### Technical Highlights:
1. The json payload to render was instructed in the prompt. 
2. ChatGPT handles the conversation context as a list in the API. In client side that list can be elegantly stored in session store. The context enables the "challange" feature. 