import DynamicSignUp from "../Components/dynamic-sign-up/DynamicSignUp";
import {Logo} from "../Components/HeroComponent"
import { TypedText, ContentItem } from "../Components//TypedText";

function onButtonClick(){
    console.log("Wryte-Byte")
}


const aboutUsContent: ContentItem[] = [
{ type: 'h5', content: "We're not just changing how writing assessment is managed. We're revolutionizing education." },
{ type: 'p', content: "At Writer Block, we believe in the power of words and the potential of every student. Our AI-powered writing assessment tool isn't just smart—it's intuitive, empowering, and transformative." },
{ type: 'h5', content: 'Our Mission' },
{ type: 'p', content: 'To unlock the full potential of student writing, one sentence at a time.' },
{ type: 'h5', content: 'What we do'},
{ type: 'p', content: "We've harnessed the power of advanced AI to create a writing assessment tool that's light-years ahead. It doesn't just grade—it understands, guides, and inspires."},
{ type: 'p', content: "Our technology doesn't replace teachers. It amplifies their impact, giving them superpowers to nurture the next generation of great writers."},
{ type: 'h5', content: "Why It Matters"},
{ type: 'p', content: "In a world where communication is key, we're equipping students with the tools they need to express themselves clearly, confidently, and creatively."},
{ type: 'h5', content: "Stay tuned for Updates"},
{ type: 'p', content: "Get ready to experience the future of writing assessment. It's not just faster. It's not just smarter. It's a whole new way to learn, grow, and achieve."},
{ type: 'p', content: "Welcome to the future of education. Welcome to Writer Block"}
];

const buttons = [
    { text: 'Teachers', color: '#EA4335' },
    { text: 'Students', color: '#34A853' },
    { text: 'Sign Up', color: '#FBBC05' },
    { text: 'About Us', color: '#4285F4' },
];

interface TypingSpeed {
    heading: number;
    paragraph: number;
    backspace: number;
    subHeading: number;
  };

const speed : TypingSpeed = {
    heading : 70,
    paragraph :  1,
    backspace: 1,
    subHeading: 5
}

export function HomePage(){
    return (
        <div className="w-full min-h-screen">
            <div className="pt-10">
                <Logo onButtonClick={onButtonClick} buttons={buttons}/>
            </div>
            <div className="min-w-96 mt-20 pb-10">
                <div>
                    <TypedText 
                        isVisible={true}
                        isDarkMode={true}
                        content={[{ type: 'h1', content: 'Writer - Block ' }]}
                        blinking={false}
                        typingSpeed = {speed}
                    />
                </div>
                <span>
                    <TypedText
                        isVisible={true}
                        isDarkMode={true}
                        content={aboutUsContent}
                        initialDelay={2500}
                        typingSpeed={speed}
                        blinking={true}
                    />
                </span>
            </div>
            <DynamicSignUp />
        </div>
    )
}