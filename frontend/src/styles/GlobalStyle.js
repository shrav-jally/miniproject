import {createGlobalStyle} from 'styled-components'

export const GlobalStyle = createGlobalStyle`
    *{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
    }

    :root{
        --primary-color: #2ABF4A;
        --primary-color-dark: #229F3E;
        --color-accent: #2ABF4A;
        --color-delete: #FF0000;
        --color-green: #42AD00;
        
        /* Light theme colors */
        --bg-light: #ffffff;
        --text-light: #333333;
        --border-light: #e6e6e6;
        --sidebar-light: #fcf6f9;
        --card-bg-light: #ffffff;
        
        /* Dark theme colors */
        --bg-dark: #1a1a1a;
        --text-dark: #ffffff;
        --border-dark: #3f3f3f;
        --sidebar-dark: #2c2c2c;
        --card-bg-dark: #2c2c2c;
    }

    body{
        font-family: 'Roboto', sans-serif;
        font-size: clamp(1rem, 1.5vw, 1.2rem);
        color: rgba(34, 34, 96, .6);
        transition: all 0.3s ease;
        background-color: var(--bg-light);
    }

    body.dark-mode {
        background-color: var(--bg-dark);
        color: var(--text-dark);

        input, textarea, select {
            background-color: var(--sidebar-dark);
            color: var(--text-dark);
            border-color: var(--border-dark);
        }

        button {
            &:not(.theme-toggle) {
                background-color: var(--sidebar-dark);
                color: var(--text-dark);
                border-color: var(--border-dark);
            }
        }

        .chart-container {
            background-color: var(--sidebar-dark);
        }

        .card {
            background-color: var(--card-bg-dark);
            border-color: var(--border-dark);
        }

        nav {
            background-color: var(--sidebar-dark);
            border-color: var(--border-dark);
        }

        a {
            color: var(--text-dark);
        }
    }

    body:not(.dark-mode) {
        background-color: var(--bg-light);
        color: var(--text-light);

        input, textarea, select {
            background-color: var(--sidebar-light);
            color: var(--text-light);
            border-color: var(--border-light);
        }

        .chart-container {
            background-color: var(--sidebar-light);
        }
    }

    h1, h2, h3, h4, h5, h6{
        color: inherit;
    }

    .error{
        color: var(--color-delete);
        animation: shake 0.5s ease-in-out;
        @keyframes shake {
            0%{
                transform: translateX(0);
            }
            25%{
                transform: translateX(10px);
            }
            50%{
                transform: translateX(-10px);
            }
            75%{
                transform: translateX(10px);
            }
            100%{
                transform: translateX(0);
            }
        }
    }

    /* Smooth transitions for theme changes */
    * {
        transition: background-color 0.3s ease,
                    color 0.3s ease,
                    border-color 0.3s ease,
                    box-shadow 0.3s ease;
    }
`;