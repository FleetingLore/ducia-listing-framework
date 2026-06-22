import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { useI18n } from "../hooks/useI18n";
import DocHeader from "../components/DocHeader";
import DocFooter from "../components/DocFooter";
import DeprecatedBanner from "../components/DeprecatedBanner";
import type { DocFull } from "../types";
import styles from "./DocPage.module.css";

interface DocPageProps {
    doc: DocFull;
    isAdmin: boolean;
    onDownload: () => void;
    onDeprecate: () => void;
    onDelete: () => void;
    onHome: () => void;
}

export default function DocPage({
    doc,
    isAdmin,
    onDownload,
    onDeprecate,
    onDelete,
    onHome,
}: DocPageProps) {
    const { t } = useI18n();
    const [content, setContent] = useState(doc.content || "");

    useEffect(() => {
        if (doc.content) {
            setContent(doc.content);
        }
    }, [doc.content]);

    return (
        <div>
            <DocHeader
                title={doc.title}
                isAdmin={isAdmin}
                onHome={onHome}
                onDownload={onDownload}
            />
            <main className={styles.main}>
                {doc.deprecated && <DeprecatedBanner onRestore={onDeprecate} />}
                <div className="markdown-body">
                    {content ? (
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {content}
                        </ReactMarkdown>
                    ) : (
                        <div style={{ opacity: 0.5 }}>
                            {t("doc.status.loading")}
                        </div>
                    )}
                </div>
                <DocFooter
                    createdAt={doc.created_at}
                    isAdmin={isAdmin}
                    isDeprecated={doc.deprecated}
                    onDelete={onDelete}
                    onDeprecate={onDeprecate}
                />
            </main>
        </div>
    );
}
