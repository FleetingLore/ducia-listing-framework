import React, { useState } from "react";
import { useI18n } from "../hooks/useI18n";
import styles from "./DocFooter.module.css";

interface DocFooterProps {
    createdAt: number;
    isAdmin: boolean;
    isDeprecated: boolean;
    onDelete: () => void;
    onDeprecate: () => void;
}

export default function DocFooter({
    createdAt,
    isAdmin,
    isDeprecated,
    onDelete,
    onDeprecate,
}: DocFooterProps) {
    const { t } = useI18n();
    const [confirm, setConfirm] = useState(false);

    const handleDeleteClick = () => {
        if (confirm) {
            onDelete();
            setConfirm(false);
        } else {
            setConfirm(true);
            setTimeout(() => setConfirm(false), 3000);
        }
    };

    return (
        <div className={styles.footer}>
            {!isDeprecated && (
                <button className={styles.action} onClick={onDeprecate}>
                    {t("doc.action.mark_deprecated")}
                </button>
            )}
            {isDeprecated && isAdmin && (
                <button className={styles.action} onClick={handleDeleteClick}>
                    {confirm
                        ? t("doc.action.confirm_delete")
                        : t("doc.action.delete")}
                </button>
            )}
            {isDeprecated && !isAdmin && <div />}
            <div className={styles.date}>
                {new Date(createdAt).toLocaleString()}
            </div>
        </div>
    );
}
