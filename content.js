const default_badwords = ["fuck", "shit", "bitch", "asshole", "dick", "piss", "slut", "whore", "nigga", "hell", "dickhead", "cunt", "bullshit"];

function censorText(node, wordList) {
    if (node.nodeType === 3) {
        if (
            node.parentNode &&
            (node.parentNode.nodeName === "INPUT" ||
             node.parentNode.nodeName === "TEXTAREA" ||
             node.parentNode.isContentEditable)
        ) {
            return; // Skip
        }

        let text = node.nodeValue;
        wordList.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi'); // Match whole words, case-insensitive
            text = text.replace(regex, (match) => {
                return match[0] + '*'.repeat(match.length - 2) + match[match.length - 1];
            });
        });
        node.nodeValue = text;
    } else if (node.nodeType === 1 && node.childNodes) {
        node.childNodes.forEach(child => censorText(child, wordList));
    }
}

chrome.storage.sync.get(["badWords", "censorEnabled"], (data) => {
    const badWords = data.badWords || [];
    const censorEnabled = data.censorEnabled !== undefined ? data.censorEnabled : true;

    if (!censorEnabled) return; // Exit if censoring is disabled

    censorText(document.body, badWords);

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => censorText(node, badWords));
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
});
