import React from "react";
import "./Datatable.css";
import { Check, AlertCircle, MoreVertical, Copy, Pencil, Search } from "lucide-react";

function DataTable() {
  const products = [
    { id: 5, createdAt: "09.10.2019", name: "product 1", address: "shop example/item/1", creator: "John Smith", description: "description 1", status: "Available" },
    { id: 4, createdAt: "09.10.2019", name: "product 2", address: "shop example/item/2", creator: "John Smith", description: "description 2", status: "Unavailable" },
    { id: 3, createdAt: "09.10.2019", name: "product 3", address: "shop example/item/3", creator: "John Smith", description: "description 3", status: "Available" },
    { id: 2, createdAt: "09.10.2019", name: "product 4", address: "shop example/item/4", creator: "John Smith", description: "description 4", status: "Unavailable" },
    { id: 1, createdAt: "09.10.2019", name: "product 5", address: "shop example/item/5", creator: "John Smith", description: "description 5", status: "Unavailable" },
  ];

  return (
    <div className="product-table-container">
      <div className="product-table-header">
        <h2>Product list</h2>
        <div className="product-table-search">
          <input type="text" placeholder="Search..." />
          <Search size={18} className="product-table-search-icon" />
        </div>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th><input type="checkbox" /></th>
            <th>ID</th>
            <th>created at</th>
            <th>name</th>
            <th>address</th>
            <th>creator</th>
            <th>description</th>
            <th>status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td><input type="checkbox" /></td>
              <td>{p.id}</td>
              <td>{p.createdAt}</td>
              <td className="product-table-blue-link">{p.name}</td>
              <td className="product-table-blue-link">
                {p.address}
                <Copy size={14} className="product-table-icon" />
              </td>
              <td>{p.creator}</td>
              <td>
                {p.description}
                <Pencil size={14} className="product-table-icon" />
              </td>
              <td>
                <span className={`product-table-status ${p.status === "Available" ? "product-table-available" : "product-table-unavailable"}`}>
                  {p.status === "Available" ? <Check size={14} /> : <AlertCircle size={14} />}
                  {p.status}
                </span>
              </td>
              <td><MoreVertical size={18} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
