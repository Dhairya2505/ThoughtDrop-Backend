export const lengthOfContent = async (content: string) => {
    let wordCount = 0;
    for (let i = 0 ; i<content.length ; i++){
        if(content[i] == " "){
            wordCount++;
        }
    }
    wordCount++;
    return wordCount;
}