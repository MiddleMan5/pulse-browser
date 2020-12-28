import React from "react";
import Edit from "@material-ui/icons/Edit";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteTagGroupIcon from "@material-ui/icons/DeleteForever";
import SortTagGroupIcon from "@material-ui/icons/SortByAlpha";
import TagIcon from "@material-ui/icons/LocalOffer";
import CollectTagsIcon from "@material-ui/icons/Voicemail";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { TagGroup } from "../reducers/taglibrary";
import i18n from "../services/i18n";
const Pro = undefined;

interface Props {
    classes?: any;
    anchorEl: Element;
    open: boolean;
    onClose: () => void;
    selectedTagGroupEntry: TagGroup;
    showCreateTagsDialog: () => void;
    showDeleteTagGroupDialog: () => void;
    showEditTagGroupDialog: () => void;
    moveTagGroupUp: (tagGroupId: string) => void;
    moveTagGroupDown: (tagGroupId: string) => void;
    sortTagGroup: (tagGroupId: string) => void;
    collectTagsFromLocation: (tagGroup: TagGroup) => void;
    handleCloseTagGroupMenu: () => void;
}

const TagLibraryMenu = (props: Props) => {
    function handleCollectTags() {
        props.onClose();

        if (props.selectedTagGroupEntry) {
            props.collectTagsFromLocation(props.selectedTagGroupEntry);
        }
        props.handleCloseTagGroupMenu();
    }

    function moveTagGroupUp() {
        if (props.selectedTagGroupEntry) {
            props.moveTagGroupUp(props.selectedTagGroupEntry.uuid);
        }
        props.handleCloseTagGroupMenu();
    }

    function moveTagGroupDown() {
        if (props.selectedTagGroupEntry) {
            props.moveTagGroupDown(props.selectedTagGroupEntry.uuid);
        }
        props.handleCloseTagGroupMenu();
    }

    function sortTagGroup() {
        if (props.selectedTagGroupEntry) {
            props.sortTagGroup(props.selectedTagGroupEntry.uuid);
        }
        props.handleCloseTagGroupMenu();
    }

    return (
        <div style={{ overflowY: "hidden" }}>
            <Menu anchorEl={props.anchorEl} open={props.open} onClose={props.handleCloseTagGroupMenu}>
                <MenuItem data-tid="createTags" onClick={props.showCreateTagsDialog}>
                    <ListItemIcon>
                        <TagIcon />
                    </ListItemIcon>
                    <ListItemText primary={i18n.t("core:addTags")} />
                </MenuItem>
                <MenuItem data-tid="editTagGroup" onClick={props.showEditTagGroupDialog}>
                    <ListItemIcon>
                        <Edit />
                    </ListItemIcon>
                    <ListItemText primary={i18n.t("core:editTagGroup")} />
                </MenuItem>
                <MenuItem data-tid="moveTagGroupUp" onClick={moveTagGroupUp}>
                    <ListItemIcon>
                        <ArrowUpward />
                    </ListItemIcon>
                    <ListItemText primary={i18n.t("core:moveTagGroupUp")} />
                </MenuItem>
                <MenuItem data-tid="moveTagGroupDown" onClick={moveTagGroupDown}>
                    <ListItemIcon>
                        <ArrowDownward />
                    </ListItemIcon>
                    <ListItemText primary={i18n.t("core:moveTagGroupDown")} />
                </MenuItem>
                <MenuItem data-tid="sortTagGroup" onClick={sortTagGroup}>
                    <ListItemIcon>
                        <SortTagGroupIcon />
                    </ListItemIcon>
                    <ListItemText primary={i18n.t("core:sortTagGroup")} />
                </MenuItem>
                <MenuItem data-tid="deleteTagGroup" onClick={props.showDeleteTagGroupDialog}>
                    <ListItemIcon>
                        <DeleteTagGroupIcon />
                    </ListItemIcon>
                    <ListItemText primary={i18n.t("core:deleteTagGroup")} />
                </MenuItem>
                <MenuItem
                    data-tid="collectTags"
                    onClick={handleCollectTags}
                    title={Pro ? "" : i18n.t("core:needProVersion")}
                >
                    <ListItemIcon>
                        <CollectTagsIcon />
                    </ListItemIcon>
                    <ListItemText primary={i18n.t("core:collectTagsFromLocation") + (Pro ? "" : " PRO")} />
                </MenuItem>
            </Menu>
        </div>
    );
};

export default TagLibraryMenu;
