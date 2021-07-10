// @ts-check
const STYLE = {
    ERROR: {
        color: '#F00',
    },
    ECHO: {
        color: '#CCC',
    },
    PRINT: {
        color: '#FFF',
    },
};

const store = new Map(HXS.builtins);

store.set('print', HXS.Utils.injectHelp(
    'print(data...)',
    HXS.createFunctionHandler(1, Infinity, (args, referrer, context) => {
        terminal.writeln(
            args.map(data => HXS.Utils.toString(data))
                .join(''),
            STYLE.PRINT
        );
        return null;
    })
));

store.set('__repl', HXS.Utils.injectHelp(
    'REPL Manager',
    HXS.Utils.createDict({
        setPrompt: HXS.Utils.injectHelp(
            '__repl.setPrompt(str)',
            HXS.createFunctionHandler(1, 1, (args, referrer, context) => {
                if (typeof args[0] !== 'string') {
                    HXS.Utils.raise(TypeError, 'expect a string as prompt', referrer, context);
                }
                terminal.$prompt.setSync(args[0]);
                return null;
            })
        ),
    })
));

const context = {
    store,
    source: 'repl',
};

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
                'Result: ' + HXS.Utils.toDisplay(
                    HXS.evalCode(input, context)
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
