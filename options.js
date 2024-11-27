document.addEventListener('DOMContentLoaded', () => {
    const theme = document.getElementById('theme-toggle');
    const censorEnable = document.getElementById('censor-enable'); 
    const wordList = document.getElementById('word-list');
    const newWord = document.getElementById('new-word');
    const addWord = document.getElementById('add-word');
    const reset = document.getElementById('reset-words');
    const tab = Array.from(document.querySelectorAll('.tab-button'));
    const Contents = document.querySelectorAll('.tab-content');

    tab.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.dataset.tab;
            tab.forEach(btn => btn.classList.remove('active'));
            Contents.forEach(content => content.classList.remove('active'));
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark');
        theme.checked = true;
    }

    theme.addEventListener('change', () => {
        if (theme.checked) {
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    });

    chrome.storage.sync.get("censorEnabled", (data) => {
        const censorEnabled = data.censorEnabled !== undefined ? data.censorEnabled : true;
        censorEnable.checked = censorEnabled;
    });

    censorEnable.addEventListener('change', () => {
        const censorEnabled = censorEnable.checked;
        chrome.storage.sync.set({ censorEnabled });
    });

    // Manage words
    chrome.storage.sync.get("badWords", (data) => {
        const badWords = data.badWords || [];
        badWords.forEach(addWordToUI);
    });

    addWord.addEventListener('click', () => {
        const word = newWord.value.trim();
        if (word) {
            chrome.storage.sync.get("badWords", (data) => {
                const badWords = data.badWords || [];
                if (!badWords.includes(word)) {
                    badWords.push(word);
                    chrome.storage.sync.set({ badWords }, () => {
                        addWordToUI(word);
                    });
                }
            });
            newWord.value = '';
        }
    });

    reset.addEventListener('click', () => {
        const defaultBadWords = ["fuck", "shit", "bitch", "asshole", "dick", "piss", "slut", "whore", "nigga", "hell", "dickhead", "cunt", "bullshit"];
        chrome.storage.sync.set({ badWords: defaultBadWords }, () => {
            wordList.innerHTML = '';
            defaultBadWords.forEach(addWordToUI);
        });
    });

    function addWordToUI(word) {
        const li = document.createElement('li');
        li.textContent = word;
        wordList.appendChild(li);
    }
});
