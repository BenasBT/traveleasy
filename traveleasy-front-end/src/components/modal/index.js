import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function getModalStyle() {
    const top = 50;
    const left = 50;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

export default function MyModal({modalHeader, children,open,handleClose},) {

    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);

    return(
        <div>
            <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClose={handleClose}
            >

                <div style={modalStyle} className={classes.paper}>
                    <div>
                        <IconButton className={classes.closeButton} aria-label="close" onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                        {
                            modalHeader ? <h3 id="simple-modal-title">{modalHeader}</h3>: null
                        }

                    </div>
                    {
                        modalHeader ? <hr />: null
                    }

                    <div id="simple-modal-description" className={classes.content}>
                        {children}
                    </div>
                </div>

            </Modal>
        </div>
    );
}