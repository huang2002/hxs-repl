// @ts-check
const STYLE = {
    ERROR: {
        color: '#F00',
    },
    ECHO: {
        color: '#DDD',
    },
    PRINT: {
        color: '#FFF',
    },
};

const context = new Map(HXS.builtins);

context.set('print', HXS.Common.injectHelp(
    'print(data...)',
    (rawArgs, ctx, env) => {
        const data = HXS.evalList(rawArgs, ctx, env.fileName);
        for (let i = 0; i < data.length; i++) {
            if (typeof data[i] !== 'string') {
                HXS.Common.raise(TypeError, 'expect only strings', env);
            }
        }
        terminal.writeln(data.join(' '), STYLE.PRINT);
    }
));

context.set('__repl', HXS.Common.createDict({
    setPrompt: HXS.Common.injectHelp(
        '__repl.setPrompt(str)',
        (rawArgs, context, env) => {
            const args = HXS.evalList(rawArgs, context, env.fileName);
            HXS.Common.checkArgs(args, env, '__repl.setPrompt', 1, 1);
            if (typeof args[0] !== 'string') {
                HXS.Common.raise(TypeError, 'expect a string as prompt', env);
            }
            terminal.$prompt.setSync(args[0]);
        }
    ),
}));

const terminal = new T.Terminal(
    {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        fontSize: '16px',
        fontFamily: 'Consolas, monospace',
    },
    input => {
        try {
            terminal.writeln(
                HXS.Common.toString(
                    HXS.evalCode(input, context, '<repl>')
                ),
                STYLE.ECHO,
            );
        } catch (error) {
            terminal.writeln('Error: ' + error.message, STYLE.ERROR);
        }
    },
);

document.body.appendChild(terminal.container);

terminal.write('Welcome to the online REPL environment of ')
    .write('hxs', { color: '#FFF' })
    .writeln('!');

terminal.writeln('Type your code in the text input at the bottom and press Enter to run it.');

terminal.writeln('Use `__repl` to interact with REPL environment.');
