import {h} from 'preact';

/**
 * Returns the Add SVG
 *
 * @return {*}
 * @constructor
 */
const GB = () => {
    return (
        <svg style={{width: "50px"}} xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 60 30">
            <path fill="#00247D" d="M0,0v30h60V0H0z"/>
            <polygon fill="#FFFFFF" points="60,20 60,10 46.7,10 61.3,2.7 58.7,-2.7 35,9.1 35,0 25,0 25,9.1 1.3,-2.7 -1.3,2.7 13.3,10 0,10 0,20 13.3,20 -1.3,27.3 1.3,32.7 25,20.9 25,30 35,30 35,20.9 58.7,32.7 61.3,27.3 46.7,20 "/>
            <path fill="#CF142B" d="M60,12H33V0h-6v12H0v6h27v12h6V18h27V12z M60.9,1.8l-1.8-3.6L35.5,10h8.9L60.9,1.8z M24.5,10L0.9-1.8l-1.8,3.6L15.5,10H24.5z M-0.9,28.2l1.8,3.6L24.5,20h-8.9L-0.9,28.2z M35.5,20l23.6,11.8l1.8-3.6L44.5,20H35.5z"/>
        </svg>
    )
};

export default GB;
