// ==UserScript==
// @name         Uranium Auto Clicker ♾️🔥
// @namespace    https://geturanium.io/
// @version      1.3
// @description  Automatically click 3 buttons and refine infinitely in Uranium.io
// @author       Kyaa-A
// @match        https://www.geturanium.io/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/Kyaa-A/uranium-autoclicker/main/uranium-autoclicker.user.js
// @downloadURL  https://raw.githubusercontent.com/Kyaa-A/uranium-autoclicker/main/uranium-autoclicker.user.js
// ==/UserScript==


(function () {
    'use strict';

    const buttonTitles = ['Auto Collector', 'Shard Multiplier', 'Conveyor Booster'];

    function simulateClick(element, offsetX = 0, offsetY = 0) {
        if (!element) return false;

        // Skip if visually disabled via opacity class and has no progress indicator
        if (element.classList.contains('opacity-50') && !element.querySelector('.h-full.rounded-full')) {
            return false;
        }

        const rect = element.getBoundingClientRect();
        const clientX = rect.left + rect.width / 2 + offsetX;
        const clientY = rect.top + rect.height / 2 + offsetY;
        const events = [
            new PointerEvent('pointerdown', { bubbles: true, clientX, clientY }),
            new MouseEvent('mousedown', { bubbles: true, clientX, clientY }),
            new MouseEvent('mouseup', { bubbles: true, clientX, clientY }),
            new MouseEvent('click', { bubbles: true, clientX, clientY }),
            new PointerEvent('pointerup', { bubbles: true, clientX, clientY })
        ];
        events.forEach(event => element.dispatchEvent(event));
        return true;
    }

    function findButtonByTitle(title) {
        const allButtons = Array.from(document.querySelectorAll('button'));

        return allButtons.find(button => {
            const h3 = button.querySelector('h3');
            return h3 && h3.textContent.includes(title);
        });
    }

    function getButtonStatus(button) {
        if (!button) return { found: false };

        // Check if active with progress
        const progressBar = button.querySelector('.h-full.rounded-full');
        const timeElement = button.querySelector('.text-xs.font-medium');
        const timeText = timeElement ? timeElement.textContent.trim() : '';
        const remainingMatch = timeText.match(/(\d+)m\s*(\d+)s|(\d+)s/);

        let remainingSeconds = 0;
        if (remainingMatch) {
            if (remainingMatch[1] && remainingMatch[2]) {
                // Format: "2m 13s"
                remainingSeconds = parseInt(remainingMatch[1]) * 60 + parseInt(remainingMatch[2]);
            } else if (remainingMatch[3]) {
                // Format: "9s"
                remainingSeconds = parseInt(remainingMatch[3]);
            }
        }

        return {
            found: true,
            isActive: !!progressBar,
            isEnabled: !button.disabled,
            remainingTime: timeText,
            remainingSeconds: remainingSeconds
        };
    }

    function clickMainButton(index) {
        if (window.location.pathname !== '/') return false;
        const title = buttonTitles[index];

        const button = findButtonByTitle(title);
        if (!button) {
            console.log(`❌ Button ${title} not found`);
            return false;
        }

        const status = getButtonStatus(button);

        if (status.isEnabled) {
            const clicked = simulateClick(button);
            console.log(clicked ? `✅ Clicked ${title}` : `❌ Could not click ${title}`);
            return true;
        } else if (status.isActive) {
            console.log(`⏳ ${title} is running (${status.remainingTime})`);
            return false;
        } else {
            console.log(`⚠️ ${title} is not available`);
            return false;
        }
    }

    function clickNextAvailableButton() {
        if (window.location.pathname !== '/') return false;

        // Find the button with the shortest remaining time or any available button
        let shortestTime = Infinity;
        let shortestIndex = -1;
        let availableIndex = -1;

        for (let i = 0; i < buttonTitles.length; i++) {
            const button = findButtonByTitle(buttonTitles[i]);
            if (!button) continue;

            const status = getButtonStatus(button);

            if (status.isEnabled) {
                availableIndex = i;
                break;
            } else if (status.isActive && status.remainingSeconds < shortestTime) {
                shortestTime = status.remainingSeconds;
                shortestIndex = i;
            }
        }

        // If a button is available, click it
        if (availableIndex !== -1) {
            return clickMainButton(availableIndex);
        }

        // Otherwise, report the button with the shortest time remaining
        if (shortestIndex !== -1) {
            const title = buttonTitles[shortestIndex];
            const button = findButtonByTitle(title);
            const status = getButtonStatus(button);
            console.log(`⏱️ Waiting for ${title} (${status.remainingTime})`);
        }

        return false;
    }

    function clickStartRefining() {
        if (!window.location.pathname.includes('/refinery')) return false;
        const button = document.querySelector('button.bg-gradient-to-r.from-teal-700.to-sky-400');
        if (button) {
            const clicked = simulateClick(button);
            console.log(clicked ? '✅ Clicked Start Refining' : '❌ Could not click Start Refining');
            return true;
        }
        console.log('❌ Start Refining not found');
        return false;
    }

    function waitForButtons() {
        return new Promise(resolve => {
            let attempts = 0;
            const observer = new MutationObserver(() => {
                if (
                    document.querySelectorAll('button h3').length > 0 ||
                    document.querySelector('button.bg-gradient-to-r.from-teal-700.to-sky-400') ||
                    document.querySelector('a[href="/refinery"], a[href="/"]')
                ) {
                    observer.disconnect();
                    resolve();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            const interval = setInterval(() => {
                attempts++;
                if (
                    document.querySelectorAll('button h3').length > 0 ||
                    document.querySelector('button.bg-gradient-to-r.from-teal-700.to-sky-400') ||
                    document.querySelector('a[href="/refinery"], a[href="/"]') ||
                    attempts >= 20
                ) {
                    observer.disconnect();
                    clearInterval(interval);
                    resolve();
                }
            }, 500);
        });
    }

    function navigateTo(to) {
        const link = document.querySelector(`a[href="${to}"]`);
        if (link) {
            simulateClick(link);
        } else {
            window.location.href = `https://www.geturanium.io${to}`;
        }
    }

    function allButtonsActive() {
        for (let i = 0; i < buttonTitles.length; i++) {
            const button = findButtonByTitle(buttonTitles[i]);
            if (!button) continue;

            const status = getButtonStatus(button);
            if (!status.isActive) return false;
        }
        return true;
    }

    async function startAutoClick() {
        await waitForButtons();

        let cycleCount = parseInt(localStorage.getItem('cycleCount') || '0');
        let phase = localStorage.getItem('phase') || 'main';
        let phaseStartTime = parseInt(localStorage.getItem('phaseStartTime') || Date.now());
        let buttonClickCount = parseInt(localStorage.getItem('buttonClickCount') || '0');

        if (window.autoClickInterval) clearInterval(window.autoClickInterval);

        window.autoClickInterval = setInterval(() => {
            const elapsed = (Date.now() - phaseStartTime) / 1000;

            if (phase === 'main' && window.location.pathname === '/') {
                // Try to click any available button
                const clicked = clickNextAvailableButton();

                if (clicked) {
                    buttonClickCount++;
                    localStorage.setItem('buttonClickCount', buttonClickCount);
                }

                // Count a cycle if all buttons are active
                if (allButtonsActive() && cycleCount === 0) {
                    cycleCount++;
                    localStorage.setItem('cycleCount', cycleCount);
                    console.log(`🔁 Cycle ${cycleCount}/20 started`);
                }

                // Check if it's time to go to refinery (after ~66 cycles)
                if (elapsed > 600) { // ~10 minutes
                    navigateTo('/refinery');
                    phase = 'refinery';
                    phaseStartTime = Date.now();
                    localStorage.setItem('phase', phase);
                    localStorage.setItem('phaseStartTime', phaseStartTime);
                }
            } else if (phase === 'refinery' && window.location.pathname.includes('/refinery')) {
                clickStartRefining();
                if (elapsed >= 5) {
                    navigateTo('/');
                    phase = 'main';
                    phaseStartTime = Date.now();
                    cycleCount = 0;
                    buttonClickCount = 0;
                    localStorage.setItem('phase', phase);
                    localStorage.setItem('phaseStartTime', phaseStartTime);
                    localStorage.setItem('cycleCount', cycleCount);
                    localStorage.setItem('buttonClickCount', buttonClickCount);
                }
            } else {
                // Handle page reload or navigation
                if (window.location.pathname.includes('/refinery') && phase !== 'refinery') {
                    phase = 'refinery';
                    phaseStartTime = Date.now();
                    localStorage.setItem('phase', phase);
                    localStorage.setItem('phaseStartTime', phaseStartTime);
                } else if (window.location.pathname === '/' && phase !== 'main') {
                    phase = 'main';
                    phaseStartTime = Date.now();
                    cycleCount = 0;
                    buttonClickCount = 0;
                    localStorage.setItem('phase', phase);
                    localStorage.setItem('phaseStartTime', phaseStartTime);
                    localStorage.setItem('cycleCount', cycleCount);
                    localStorage.setItem('buttonClickCount', buttonClickCount);
                }
            }

            console.log(`⏱️ Phase: ${phase} | Cycle: ${cycleCount}/20 | ${elapsed.toFixed(1)}s | Page: ${window.location.pathname}`);
        }, 1000);
    }

    // Also automatically click on uranium shards if they appear
    function setupShardClicker() {
        const observer = new MutationObserver(mutations => {
            const shards = document.querySelectorAll('.uranium-shard:not([data-clicked="true"])');
            shards.forEach(shard => {
                simulateClick(shard);
                shard.setAttribute('data-clicked', 'true');
                console.log(`✅ Clicked shard: ${shard.id}`);
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    window.addEventListener('load', () => {
        console.log('♻️ uranium.io Auto Clicker ready...');
        startAutoClick();
        setupShardClicker();
    });
})();