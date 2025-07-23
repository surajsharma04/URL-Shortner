document.addEventListener('DOMContentLoaded', () => {
    const shortenForm = document.getElementById('shorten-form');
    const longUrlInput = document.getElementById('long-url-input');
    const resultContainer = document.getElementById('result-container');
    const shortUrlLink = document.getElementById('short-url-link');
    const copyButton = document.getElementById('copy-button');
    const copyFeedback = document.getElementById('copy-feedback');

    // The backend API endpoint is now our Node.js server
    const apiUrl = 'http://localhost:3000/shorten';

    shortenForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const longUrl = longUrlInput.value;
        if (!longUrl) {
            alert('Please enter a URL.');
            return;
        }

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ longUrl: longUrl }), // The key is 'longUrl'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
            
            // Display the result
            shortUrlLink.href = data.short_url;
            shortUrlLink.textContent = data.short_url;
            resultContainer.classList.remove('hidden');
            copyFeedback.classList.add('hidden');

        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(shortUrlLink.href).then(() => {
            copyFeedback.classList.remove('hidden');
            setTimeout(() => {
                copyFeedback.classList.add('hidden');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            alert('Failed to copy URL.');
        });
    });
});