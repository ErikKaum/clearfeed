

import { loadLayersModel, tensor2d } from '@tensorflow/tfjs'

const predictSentiment = async (tweets) => {

    const model = await loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json');
    const metadataJson = await fetch('https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json');
    const metadata = await metadataJson.json();
 
    const wordIndexIn = metadata['word_index']
    const vocabularySize = metadata['vocabulary_size']
    const indexFrom = metadata['index_from']
    const maxLen = metadata['max_len']

    const results = []
    tweets.forEach(element => {
       const text = element.text
       const res = predict(text,  wordIndexIn, vocabularySize, indexFrom, maxLen, model) 
      //  console.log(text, res)
      
       results.push(res.score)
    });
    return results
}


const predict = (text, wordIndexIn, vocabularySize, indexFrom, maxLen, model) => {
    const OOV_INDEX = 2

    const inputText =
    text.trim().toLowerCase().replace(/(\.|\,|\!)/g, '').split(' ');
    // Convert the words to a sequence of word indices.
    const sequence = inputText.map(word => {
    let wordIndex = wordIndexIn[word] + indexFrom;
    if (wordIndex > vocabularySize) {
        wordIndex = OOV_INDEX;
    }
    return wordIndex;
    });
    // Perform truncation and padding.
    const paddedSequence = padSequences([sequence], maxLen);
    const input = tensor2d(paddedSequence, [1, maxLen]);

    const predictOut = model.predict(input);
    const score = predictOut.dataSync()[0];
    predictOut.dispose();

    return {score: score};

}

function padSequences(
    sequences, maxLen, padding = 'pre', truncating = 'pre', value = 0) {
  // TODO(cais): This perhaps should be refined and moved into tfjs-preproc.
  return sequences.map(seq => {
    // Perform truncation.
    if (seq.length > maxLen) {
      if (truncating === 'pre') {
        seq.splice(0, seq.length - maxLen);
      } else {
        seq.splice(maxLen, seq.length - maxLen);
      }
    }

    // Perform padding.
    if (seq.length < maxLen) {
      const pad = [];
      for (let i = 0; i < maxLen - seq.length; ++i) {
        pad.push(value);
      }
      if (padding === 'pre') {
        seq = pad.concat(seq);
      } else {
        seq = seq.concat(pad);
      }
    }

    return seq;
  });
}




export default predictSentiment



