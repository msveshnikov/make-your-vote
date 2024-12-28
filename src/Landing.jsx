import { useEffect } from 'react';

export function Landing() {
    useEffect(() => {
        fetch('/landing.html')
            .then((response) => response.text())
            .then((html) => {
                const container = document.getElementById('landing-container');
                container.innerHTML = html;

                const scripts = container.getElementsByTagName('script');
                Array.from(scripts).forEach((oldScript) => {
                    const newScript = document.createElement('script');

                    Array.from(oldScript.attributes).forEach((attr) => {
                        newScript.setAttribute(attr.name, attr.value);
                    });
                    newScript.textContent = oldScript.textContent;
                    oldScript.parentNode.replaceChild(newScript, oldScript);
                });
            });
    }, []);

    return <div id="landing-container"></div>;
}
