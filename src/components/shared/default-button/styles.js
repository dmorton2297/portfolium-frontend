const styles = theme => {
    return ({
        button: {
            backgroundColor: theme.palette.primary.dark,
            color: theme.palette.primary.light,
            minWidth: 100,
            marginRight: 10
        },
        warn: {
            backgroundColor: theme.palette.primary.warn,
            color: theme.palette.primary.light,
            width: 100,
            marginRight: 10
        }
    });
};

export default styles;