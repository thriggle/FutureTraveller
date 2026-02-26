(function () {
    function insertDisclaimer() {
        const currentYear = new Date().getFullYear();
        const disclaimerHtml = `The Traveller game in all forms is owned by Mongoose Publishing. Copyright ${currentYear} Mongoose Publishing.`;
        let footer = document.querySelector('.footer');
        if (!footer) {
            footer = document.createElement('div');
            footer.className = 'footer';
            document.body.appendChild(footer);
        }
        footer.innerHTML = disclaimerHtml;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', insertDisclaimer);
    } else {
        insertDisclaimer();
    }
})();
