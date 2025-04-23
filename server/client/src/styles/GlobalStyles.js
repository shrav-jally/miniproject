import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    :root {
        --primary-color: #222260;
        --primary-color2: 'color: rgba(34, 34, 96, .6)';
        --primary-color3: 'color: rgba(34, 34, 96, .4)';
        --color-green: #42AD00;
        --color-grey: #aaa;
        --color-accent: #F56692;
        --color-delete: #FF0000;
        
        // Light mode colors
        --bg-color: rgba(252, 246, 249, 0.78);
        --sidebar-bg: #fff;
        --card-bg: #fff;
        --text-color: #222260;
        --text-muted: #666;
        --border-color: #ddd;
    }

    .dark-mode {
        --bg-color: #1a1a2e;
        --sidebar-bg: #222260;
        --card-bg: #2a2a4a;
        --text-color: #fff;
        --text-muted: #bbb;
        --border-color: #444;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style: none;
    }

    body {
        font-family: 'Nunito', sans-serif;
        background: var(--bg-color);
        color: var(--text-color);
        transition: all 0.3s ease;
    }

    a {
        color: inherit;
        text-decoration: none;
    }

    .error {
        color: red;
        animation: shake 0.5s ease-in-out;
        margin: 0.5rem 0;
    }

    @keyframes shake {
        0% { transform: translateX(0); }
        25% { transform: translateX(10px); }
        50% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
        100% { transform: translateX(0); }
    }

    /* Responsive Design */
    @media (max-width: 1200px) {
        html {
            font-size: 95%;
        }
    }

    @media (max-width: 968px) {
        html {
            font-size: 90%;
        }
    }

    @media (max-width: 768px) {
        html {
            font-size: 85%;
        }
    }

    @media (max-width: 480px) {
        html {
            font-size: 80%;
        }
    }
`;

export default GlobalStyle; 