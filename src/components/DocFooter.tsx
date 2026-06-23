import React, { useState } from "react";
import { useI18n } from "../hooks/useI18n";
import styles from "./DocFooter.module.css";

interface DocFooterProps {
    createdAt: number;
    isAdmin: boolean;
    isDeprecated: boolean;
    isLocked: boolean;
    onDelete: () => void;
    onDeprecate: () => void;
    onLock: () => void;
}

export default function DocFooter({
    createdAt,
    isAdmin,
    isDeprecated,
    isLocked,
    onDelete,
    onDeprecate,
    onLock,
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

    // 非管理员且文档锁定时不能弃用
    const canDeprecate = !isLocked || isAdmin;
    // 已弃用且锁定的文档不能恢复
    const canRestore = isDeprecated && (!isLocked || isAdmin);
    // 已弃用的文档可以删除
    const canDelete = isDeprecated && isAdmin;

    return (
        <div className={styles.footer}>
            {/* 锁定按钮（仅管理员可见） */}
            {isAdmin && (
                <button className={styles.action} onClick={onLock}>
                    {isLocked ? "🔒 " : "🔓 "}
                    {isLocked ? t("doc.action.unlock") : t("doc.action.lock")}
                </button>
            )}

            {/* 弃用/恢复按钮 */}
            {!isDeprecated && canDeprecate && (
                <button className={styles.action} onClick={onDeprecate}>
                    {t("doc.action.mark_deprecated")}
                </button>
            )}
            {isDeprecated && canRestore && (
                <button className={styles.action} onClick={onDeprecate}>
                    {t("doc.action.restore")}
                </button>
            )}

            {/* 删除按钮 */}
            {canDelete && (
                <button className={styles.action} onClick={handleDeleteClick}>
                    {confirm
                        ? t("doc.action.confirm_delete")
                        : t("doc.action.delete")}
                </button>
            )}

            {isDeprecated && !isAdmin && !canRestore && <div />}
            <div className={styles.date}>
                {new Date(createdAt).toLocaleString()}
            </div>
        </div>
    );
}
