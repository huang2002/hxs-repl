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

context.set('print', (rawArgs, ctx, env) => {
    const data = HXS.evalList(rawArgs, ctx, env.fileName);
    terminal.writeln(data.join(' '), STYLE.PRINT);
});

document.body.appendChild(terminal.container);
