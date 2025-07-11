export const navigationItems = [
  {
    id: "Home",
    label: "Home",
    icon: "home",
    type: "simple",
  },
  {
    id: "LaporanKeuangan",
    label: "Laporan Keuangan",
    icon: "report",
    type: "simple",
  },
  {
    id: "LaporanStok",
    label: "Laporan Stok",
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
    type: "dropdown",
    submenu: [
      {
        id: "UserList",
        label: "User List",
        icon: "users",
      },
      {
        id: "CreateUser",
        label: "Create User",
        icon: "userPlus",
      },
    ],
  },
];
