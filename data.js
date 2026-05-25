export const quizzes = {
    "Logic and IQ": [
        {
            image: "images/logicIQ.jpg",
            description: "Sharpen your reasoning and analytical thinking. This quiz tests pattern recognition, abstract logic, lateral thinking, and numerical sequences — the core building blocks of a high IQ.",
            timeLimit: 180, // 3 minutes
            question: "If all Bloops are Razzles and all Razzles are Lazzles, are all Bloops definitely Lazzles?",
            answers: ["Yes", "No", "Only some of them", "Cannot be determined"],
            correct: 0
        },
        {
            question: "What comes next in the sequence: 2, 6, 12, 20, 30... ?",
            answers: ["36", "40", "42", "48"],
            correct: 2
        },
        {
            question: "If a circle is one, how many is an octagon?",
            answers: ["Four", "Six", "Eight", "Ten"],
            correct: 2
        },
        {
            question: "What has keys but can't open locks?",
            answers: ["A map", "A piano", "A tree", "A book"],
            correct: 1
        },
        {
            question: "If two typographic errors are made on every page of a 400-page book, how many errors are there?",
            answers: ["200", "400", "800", "1200"],
            correct: 2
        }
    ],
    "Web Design": [
        {
            image: "images/webdesign.jpg",
            description: "Dive into the core methodologies that define modern digital interfaces. This quiz covers responsive grid systems, accessible typography, color theory applications, and the psychological impact of whitespace in user experience design.",
            timeLimit: 240, // 4 minutes
            question: "What is the primary goal of User Experience (UX) design?",
            answers: [
                "To make the interface visually stunning and artistic.",
                "To ensure the user finds value, ease, and efficiency in interaction.",
                "To write clean and optimized code for the backend.",
                "To increase the density of information on the home page."
            ],
            correct: 1
        },
        {
            question: "Which CSS property is crucial for creating responsive grid layouts?",
            answers: ["display: flex", "display: block", "display: grid", "float: left"],
            correct: 2
        },
        {
            question: "What does 'accessibility' (a11y) in web design primarily refer to?",
            answers: [
                "How fast the website loads globally",
                "Ensuring the site is usable by people with disabilities",
                "Making sure the source code is public",
                "Allowing search engines to index the site highly"
            ],
            correct: 1
        },
        {
            question: "What is the recommended approach for mobile web design?",
            answers: ["Mobile-first", "Desktop-first", "Fixed-width", "App-only"],
            correct: 0
        },
        {
            question: "Which of these is NOT a primary principle of Gestalt psychology in design?",
            answers: ["Proximity", "Similarity", "Velocity", "Closure"],
            correct: 2
        }
    ],
    "UX Design": [
        {
            image: "images/ux.jpg",
            description: "Explore the human side of product design. This quiz covers user research methods, personas, empathy mapping, heuristic evaluation, and the art of building interfaces that people actually love to use.",
            timeLimit: 300, // 5 minutes
            question: "What is 'information architecture'?",
            answers: [
                "The physical servers hosting the site",
                "The structural design of shared information environments",
                "The layout of physical office spaces for designers",
                "The database schema of the application"
            ],
            correct: 1
        },
        {
            question: "Which user research method involves watching users interact with a product?",
            answers: ["A/B Testing", "Card Sorting", "Usability Testing", "Surveys"],
            correct: 2
        },
        {
            question: "What is a 'persona' in UX?",
            answers: [
                "The lead designer on the project",
                "A fictional character representing a user type",
                "The branding personality of the company",
                "The avatar users upload to their profiles"
            ],
            correct: 1
        },
        {
            question: "What does an empathy map help a team achieve?",
            answers: [
                "Understanding what a user says, thinks, does, and feels",
                "Mapping the competitive landscape",
                "Tracing the user's clicks on a page",
                "Planning the software architecture"
            ],
            correct: 0
        },
        {
            question: "What is 'heuristic evaluation'?",
            answers: [
                "Automated performance testing",
                "A method where experts review a UI against recognized principles",
                "A/B split testing of two designs",
                "Writing code that evaluates its own performance"
            ],
            correct: 1
        }
    ],
    "Motion Graphics": [
        {
            image: "images/motiondesign.jpg",
            description: "Bring your designs to life. This quiz covers the 12 principles of animation, easing curves, keyframe techniques, frame rates, rotoscoping, and the storytelling mechanics that make motion graphics truly captivating.",
            timeLimit: 210, // 3.5 minutes
            question: "In animation, what does 'easing' refer to?",
            answers: [
                "Making the illustrator's job easier",
                "The transition of speed during an animation",
                "Lowering the resolution of an image to render it faster",
                "Removing keyframes randomly"
            ],
            correct: 1
        },
        {
            question: "Which of the following is a classic principle of animation?",
            answers: ["Squash and stretch", "Compile and run", "Push and pull", "Save and load"],
            correct: 0
        },
        {
            question: "What is the standard frame rate for cinematic animation?",
            answers: ["12 fps", "24 fps", "30 fps", "60 fps"],
            correct: 1
        },
        {
            question: "What is a 'keyframe'?",
            answers: [
                "A frame that holds the secret password to the file",
                "A drawing that defines the starting and ending points of any smooth transition",
                "The very first frame of a movie",
                "The border around the animation canvas"
            ],
            correct: 1
        },
        {
            question: "In motion graphics, what is 'rotoscoping'?",
            answers: [
                "Animating purely with code",
                "Tracing over motion picture footage frame by frame",
                "Rotating a 3D model continuously",
                "Recording voiceovers for characters"
            ],
            correct: 1
        }
    ]
};