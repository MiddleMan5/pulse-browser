import React from "react";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Dialog from "@material-ui/core/Dialog";
import i18n from "../services/i18n";
const Pro = undefined;
import AppConfig from "../config";
import LicenseContent from "../LICENSE.txt";
import PlatformIO from "../services/platform-io";

interface Props {
    open: boolean;
    fullScreen: boolean;
    onClose: () => void;
}

// function printElem(elem) {
//   const printWin = window.open('', 'PRINT', 'height=400,width=600');
//   printWin.document.write('<html><head><title>License Agreement</title>');
//   printWin.document.write('</head><body >');
//   printWin.document.write(elem.innerHTML);
//   printWin.document.write('</body></html>');
//   printWin.document.close(); // necessary for IE >= 10
//   printWin.focus(); // necessary for IE >= 10*/
//   printWin.print();
//   printWin.close();
//   return true;
// }

const LicenseDialog = (props: Props) => {
    const { fullScreen, open, onClose } = props;
    // let licenseElement;
    // function printLicense() {
    //   // printElem(licenseElement);
    //   window.print();
    // }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            keepMounted
            disableBackdropClick
            disableEscapeKeyDown
            fullScreen={fullScreen}
            scroll="paper"
        >
            <DialogTitle>{i18n.t("core:license")}</DialogTitle>
            <DialogContent
                // inputRef={ref => {
                //   licenseElement = ref;
                // }}
                style={{ overflow: AppConfig.isFirefox ? "auto" : "overlay" }}
            >
                <pre style={{ whiteSpace: "pre-wrap" }}>{Pro ? Pro.EULAContent : LicenseContent}</pre>
            </DialogContent>
            <DialogActions>
                {/* <Button
          onClick={printLicense}
          color="primary"
        >
          {i18n.t('core:print')}
        </Button> */}
                <Button data-tid="confirmLicenseDialog" onClick={PlatformIO.quitApp} color="primary">
                    {i18n.t("core:quit")}
                </Button>
                <Button data-tid="agreeLicenseDialog" onClick={props.onClose} color="primary">
                    {i18n.t("core:agreeLicense")}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default withMobileDialog()(LicenseDialog);
