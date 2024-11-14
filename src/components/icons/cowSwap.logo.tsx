import React, { SVGProps } from 'react'

export default function CowSwapSVG(props: SVGProps<SVGSVGElement>) {
    return (
        <svg className={props.className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 36 24">
            <desc>CoW Protocol</desc>
            <path
                fill="white"
                fillRule="evenodd"
                d="M13.653 24a4.011 4.011 0 0 1-3.824-2.79L7.11 12.666H5.44a4.01 4.01 0 0 1-3.825-2.791L0 4.8h6.058L2.863 0h30.274l-3.195 4.8H36l-1.615 5.076a4.01 4.01 0 0 1-3.825 2.79h-1.67l-2.72 8.544A4.01 4.01 0 0 1 22.346 24h-8.693ZM11.6 10.333c0 1.289.965 2.334 2.156 2.334 1.19 0 2.155-1.045 2.155-2.334 0-1.288-.965-2.333-2.155-2.333S11.6 9.045 11.6 10.333Zm12.8 0c0 1.289-.965 2.334-2.156 2.334-1.19 0-2.155-1.045-2.155-2.334 0-1.288.965-2.333 2.155-2.333S24.4 9.045 24.4 10.333Z"
                clipRule="evenodd"
            ></path>
        </svg>
    )
}