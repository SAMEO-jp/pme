"use client"

import React, { useState } from "react";
import Link from "next/link";
import { OrganizeSection } from "./components/OrganizeSection";
import { RegisterSection } from "./components/RegisterSection";
import { ProjectViewSection } from "./components/ProjectViewSection";
import { TechViewSection } from "./components/TechViewSection";
import { FormsSection } from "./components/FormsSection";

export default function FileManagementMain() {
  const [activeSection, setActiveSection] = useState<string>("main");

  // メインのリンク一覧
  const containers = [
    { label: "資料整理", path: "organize", items: ["プロジェクト資料整理", "技術資料整理"] },
    { label: "資料登録", path: "register", items: ["プロジェクト資料登録", "技術資料登録", "購入品資料共有情報"] },
    { label: "プロジェクト資料閲覧", path: "project-view", items: [] },
    { label: "技術資料閲覧", path: "tech-view", items: ["WBS・設備技術", "要素技術"] },
    { label: "帳票類作成一覧", path: "forms", items: [] },
  ];

  // アクティブなセクションに基づいてコンポーネントを表示
  const renderActiveSection = () => {
    switch (activeSection) {
      case "organize":
        return <OrganizeSection />;
      case "register":
        return <RegisterSection />;
      case "project-view":
        return <ProjectViewSection />;
      case "tech-view":
        return <TechViewSection />;
      case "forms":
        return <FormsSection />;
      default:
        return (
          <>
            <h1 className="text-3xl font-bold mb-8">ファイル管理システム</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl">
              {containers.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActiveSection(item.path)}
                  className="block text-left"
                >
                  <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 flex flex-col items-center justify-center text-xl font-semibold text-gray-800 min-h-48 cursor-pointer text-center">
                    <span className="mb-2">{item.label}</span>
                    {item.items.length > 0 && (
                      <ul className="text-sm text-gray-600 font-normal mt-2 list-disc pl-5">
                        {item.items.map((subItem, idx) => (
                          <li key={idx} className="mt-1">{subItem}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </>
        );
    }
  };

  // 戻るボタン
  const renderBackButton = () => {
    if (activeSection !== "main") {
      return (
        <button
          onClick={() => setActiveSection("main")}
          className="mb-4 flex items-center text-blue-600 hover:text-blue-800 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          メインメニューに戻る
        </button>
      );
    }
    return null;
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {renderBackButton()}
        {renderActiveSection()}
      </div>
    </main>
  );
} 