export const navigationItems = [
  {
    id: "Home",
    label: "Home",
    icon: "home",
    type: "simple",
  },
  {
    id: "Laporan",
    label: "Laporan",
    icon: "report",
    type: "simple",
  },
  {
    id: "Stok",
    label: "Stok",
    icon: "stock",
    type: "simple",
  },
  {
    id: "Produk",
    label: "Produk",
    icon: "product",
    type: "simple",
  },
  {
    id: "Users",
    label: "Users",
    icon: "users",
    type: "dropdown",    submenu: [
      {
        id: "UserList",
        label: "User List",
        icon: "users",
      },
      {
        id: "CreateUser",
        label: "Create User",
        icon: "userPlus",
      },    ],
  },
];