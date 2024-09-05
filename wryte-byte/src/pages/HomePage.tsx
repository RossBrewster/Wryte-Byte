import {Logo} from "../Components/HeroComponent"

function onButtonClick(){
    console.log("Wryte-Byte")
}

const buttons = [
    { text: 'Teachers', color: '#EA4335' },
    { text: 'Students', color: '#34A853' },
    { text: 'Sign Up', color: '#FBBC05' },
    { text: 'About Us', color: '#4285F4' },
  ];

export function HomePage(){
    return <Logo onButtonClick={onButtonClick} buttons={buttons}/>
}