const styles = theme => {
    return ({
        container: {
            display: 'flex',
            justfiyContent: 'space-between',
            padding: 0,
            '@media(max-width: 1000px)': {
                display: 'block',
                marginBottom: 10
            }
        },
        title: {
            width: '100%',
            padding: 20,
            fontWeight: theme.typography.bold.fontWeight,
            '&:hover': {
                color: theme.palette.primary.lightAlternate,
                cursor: 'pointer'
            },

        },
        description: {
            maxWidth: 400,
            padding: 20
        },
        infoContainer: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.lightAlternate,
            '&:hover': {
                backgroundColor: theme.palette.primary.darkAlternate,
            },
            zIndex: 1,
            display: 'grid',
            gridTemplateColumns: '420px auto',
            cursor: 'pointer',
            '@media(min-width: 1001px)': {
                width: 500,
            },
            '@media(max-width: 1000px)': {
                gridTemplateColumns: '85% 15%',
            }
        },
        tagContainer: {
            justifyContent: 'flex-end',
            padding: '5px 0',
            backgroundColor: theme.palette.primary.lightAlternateTransparent,
        },
        controlButton: {
            color: theme.palette.primary.light,
            '&:hover': {
                color: 'lightgray'
            },
            padding: '0 15px',
            paddingTop: 10,
            paddingBottom: 15,
        },
        icon: {
            height: 30,
            width: 30
        }
    })
};

export default styles;