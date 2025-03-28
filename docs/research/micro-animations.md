# Micro Animations

Would be great to add some juice to the application. Some small things happen, when users take actions.

## Initial implementation

We use Motion and Lottie-React.

For Lottie-react it is important to dynamically load the component!

If we directly import the component, we get an error during server rendering that document is not defined. Yeah that took about a day to figure out 🙈

## Initial Research

Small lib: https://react.useanimations.com/

Motion, animate elements in React https://motion.dev/

Lottie files: https://github.com/Gamote/lottie-react
ChatGPt can create Lottie files.

In `/lottie` are two ChatGPT generated files. one.json is a blinking circle and two.json is circles flying out from a central point.
