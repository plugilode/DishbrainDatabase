"use client";
import React from "react";
import Component3DButtonDesign from "../components/component-3-d-button-design";

function GeneralLedgerManager({ accounts, onUpdateAccount, onAddAccount }) {
  const [newAccountName, setNewAccountName] = React.useState("");
  const [newAccountBalance, setNewAccountBalance] = React.useState("");

  const handleAddAccount = () => {
    if (newAccountName && newAccountBalance) {
      onAddAccount({
        name: newAccountName,
        balance: parseFloat(newAccountBalance),
      });
      setNewAccountName("");
      setNewAccountBalance("");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-black">
      <h2 className="text-2xl font-cabin font-bold mb-4">General Ledger</h2>
      <p className="text-black mb-6 font-cabin">Manage your general ledger</p>

      <div className="space-y-4">
        {accounts.map((account, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 border border-black rounded p-4 shadow-sm"
          >
            <input
              type="text"
              name={`account-name-${index}`}
              value={account.name}
              onChange={(e) => onUpdateAccount(index, "name", e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 w-1/2 font-cabin"
              placeholder="Account Name"
            />
            <input
              type="number"
              name={`account-balance-${index}`}
              value={account.balance}
              onChange={(e) =>
                onUpdateAccount(index, "balance", parseFloat(e.target.value))
              }
              className="border border-gray-300 rounded px-3 py-2 w-1/2 font-cabin"
              placeholder="Account Balance"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center space-x-4">
        <input
          type="text"
          name="new-account-name"
          value={newAccountName}
          onChange={(e) => setNewAccountName(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-1/2 font-cabin"
          placeholder="New Account Name"
        />
        <input
          type="number"
          name="new-account-balance"
          value={newAccountBalance}
          onChange={(e) => setNewAccountBalance(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 w-1/2 font-cabin"
          placeholder="New Account Balance"
        />
        <Component3DButtonDesign onClick={handleAddAccount}>
          Add Account
        </Component3DButtonDesign>
      </div>
    </div>
  );
}

function GeneralLedgerManagerStory() {
  const [accounts, setAccounts] = React.useState([
    { name: "Cash", balance: 10000 },
    { name: "Accounts Receivable", balance: 5000 },
  ]);

  const handleUpdateAccount = (index, field, value) => {
    const updatedAccounts = [...accounts];
    updatedAccounts[index][field] = value;
    setAccounts(updatedAccounts);
  };

  const handleAddAccount = (newAccount) => {
    setAccounts([...accounts, newAccount]);
  };

  return (
    <div className="bg-[#A0C0DE] p-8 min-h-screen">
      <GeneralLedgerManager
        accounts={accounts}
        onUpdateAccount={handleUpdateAccount}
        onAddAccount={handleAddAccount}
      />
    </div>
  );
}

export default GeneralLedgerManager;