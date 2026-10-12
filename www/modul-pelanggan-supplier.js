// ============================================================================
// MODUL 9: PELANGGAN, TIPE PELANGGAN, SUPPLIER, & SINKRONISASI CLOUD (17 SS)
// ============================================================================

(function() {
    // 1. HAPUS PLACEHOLDER #view-pelanggan LAMA AGAR DIGANTIKAN VERSI 100% LENGKAP INI
    const oldPelangganView = document.getElementById('view-pelanggan');
    if (oldPelangganView) oldPelangganView.remove();

    // 2. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN MENU UTAMA PELANGGAN DAN SUPPLIER (SS 1000922843) === -->
        <div id="view-pelanggan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="switchView('pos')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pelanggan dan Supplier</h2>
            </div>

            <div class="divide-y divide-gray-100">
                <!-- Menu 1: Pelanggan -->
                <div onclick="openMainPelangganListView()" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl">
                        <i class="fa-regular fa-id-card"></i>
                    </div>
                    <span class="font-bold text-sm text-gray-900">Pelanggan</span>
                </div>

                <!-- Menu 2: Tipe Pelanggan + Badge Baru! -->
                <div onclick="openMainTipePelangganView()" class="p-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-center space-x-4">
                        <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl">
                            <i class="fa-regular fa-id-card"></i>
                        </div>
                        <span class="font-bold text-sm text-gray-900">Tipe Pelanggan</span>
                    </div>
                    <span class="bg-amber-400 text-white text-[11px] font-extrabold px-3 py-1 rounded-tl-xl rounded-br-xl rounded-tr-sm rounded-bl-sm shadow-2xs">Baru!</span>
                </div>

                <!-- Menu 3: Supplier -->
                <div onclick="openMainSupplierListView()" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl">
                        <i class="fa-regular fa-id-card"></i>
                    </div>
                    <span class="font-bold text-sm text-gray-900">Supplier</span>
                </div>
            </div>
        </div>

        <!-- === 2. HALAMAN DAFTAR PELANGGAN (SS 1000922844 & 1000922845) === -->
        <div id="view-main-pelanggan-list" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="switchView('pelanggan')" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pelanggan</h2>
            </div>

            <!-- Baris Filter Panah (3 Menu), Pencarian, & Barcode Kamera -->
            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20">
                <div class="relative">
                    <button onclick="toggleMainPelangganSortDropdown()" class="text-emerald-700 text-xl px-2 py-1 focus:outline-none">
                        <i class="fa-solid fa-arrow-up-wide-short"></i>
                    </button>
                    <!-- Dropdown 3 Pilihan (SS 1000922845) -->
                    <div id="dropdown-main-pelanggan-sort" class="absolute left-0 top-10 w-52 bg-white rounded-md shadow-2xl border border-gray-200 py-1.5 hidden z-50 text-xs font-medium text-gray-900">
                        <button onclick="applyMainPelangganSort('name')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Nama</button>
                        <button onclick="applyMainPelangganSort('email')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Email</button>
                        <button onclick="applyMainPelangganSort('trx')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Jumlah Transaksi</button>
                    </div>
                </div>

                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-700"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-main-pelanggan-search" oninput="renderMainPelangganList(this.value)" placeholder="Nama, email atau no telp" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>

                <button onclick="if(window.openScannerView) window.openScannerView('customer-list-search')" class="text-emerald-700 text-2xl px-2" title="Scan Barcode Pelanggan">
                    <i class="fa-solid fa-barcode"></i>
                </button>
            </div>

            <!-- Daftar Pelanggan -->
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pb-28" id="container-main-pelanggan-rows" onclick="hideMainPelangganSortDropdown()"></div>

            <!-- Panel Sticky Bawah: Tambah Pelanggan (Dari Kontak & Manual) -->
            <div class="p-3 bg-white border-t absolute bottom-0 left-0 right-0 z-10 text-center space-y-2 shadow-lg">
                <span class="text-[11px] font-bold text-gray-800 block">Tambah Pelanggan</span>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="openContactPickerView('pelanggan')" type="button" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-full text-xs shadow-sm transition active:scale-95">
                        Dari Kontak
                    </button>
                    <button onclick="openFormTambahPelangganManual()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full text-xs shadow-sm transition active:scale-95">
                        Manual
                    </button>
                </div>
            </div>
        </div>

        <!-- === 3. HALAMAN PILIH DARI KONTAK TELEPON (SS 1000922846) === -->
        <div id="view-contact-picker" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeContactPickerView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700" id="contact-picker-header-title">Tambah Pelanggan</h2>
            </div>

            <div class="p-3 bg-white space-y-3 border-b">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-700"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="input-contact-picker-search" oninput="renderContactPickerList(this.value)" placeholder="Nama" class="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-lg text-xs text-gray-900 focus:outline-none">
                </div>

                <button onclick="openManualFormFromContactPicker()" type="button" id="btn-contact-picker-manual" class="w-full border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold py-3 rounded-lg text-xs transition">
                    Tambah Pelanggan Manual
                </button>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-200" id="container-contact-picker-rows"></div>
        </div>

        <!-- === 4. HALAMAN FORM TAMBAH PELANGGAN MANUAL (SS 1000922849) === -->
        <div id="view-form-tambah-pelanggan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white flex items-center justify-between z-10">
                <button onclick="closeFormTambahPelangganManual()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                <div></div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 space-y-4 pb-28">
                <div class="flex flex-col items-center justify-center">
                    <div class="relative flex items-center justify-center">
                        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-emerald-700 text-6xl shadow-inner overflow-hidden">
                            <i class="fa-solid fa-user mt-4"></i>
                        </div>
                        <button onclick="if(window.openLivePhotoCamera) window.openLivePhotoCamera('customer')" type="button" class="absolute -right-10 bottom-2 text-emerald-600 text-xl p-1">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                    </div>
                    <h3 class="font-bold text-base text-gray-900 mt-3">Tambah Pelanggan</h3>
                </div>

                <!-- Nama Panggilan -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama Panggilan</label>
                    <input type="text" id="form-add-cust-name" placeholder="Nama Panggilan" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <!-- Poin -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Poin</label>
                    <input type="number" id="form-add-cust-points" value="0" readonly class="w-full bg-slate-100 p-3 px-4 rounded-full text-xs font-semibold text-gray-600 focus:outline-none">
                    <p class="text-[11px] text-gray-500 mt-1">Set Poin awal dapat diedit di menu Marketing-Loyalti Poin</p>
                </div>

                <!-- Kode Pelanggan + Barcode + Checkbox Buat Otomatis -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Kode Pelanggan</label>
                    <div class="flex items-center space-x-3">
                        <input type="text" id="form-add-cust-code" placeholder="Kode Pelanggan" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                        <button onclick="if(window.openScannerView) window.openScannerView('add-customer-code')" type="button" class="text-emerald-700 text-2xl px-1">
                            <i class="fa-solid fa-barcode"></i>
                        </button>
                    </div>
                    <label class="flex items-center space-x-2.5 mt-2.5 cursor-pointer">
                        <input type="checkbox" id="chk-auto-cust-code" onchange="toggleAutoCustomerCode(this.checked)" class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span class="text-[11px] font-semibold text-gray-600">Buat otomatis kode pelanggan</span>
                    </label>
                </div>

                <!-- Email (Opsional) -->
                <div>
                    <div class="flex justify-between items-center mb-1">
                        <label class="text-xs font-semibold text-gray-600">Email (Opsional)</label>
                        <span class="w-4 h-4 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[10px] font-bold">i</span>
                    </div>
                    <input type="email" id="form-add-cust-email" placeholder="Email" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                    <p class="text-[11px] text-gray-500 mt-1">Gunakan email yang valid, atau biarkan kosong</p>
                </div>

                <!-- Telepon -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Telepon</label>
                    <div class="flex items-center space-x-2">
                        <div class="px-3 py-3 text-sm font-semibold text-gray-900 flex items-center space-x-1">
                            <span>+62</span><i class="fa-solid fa-caret-down text-xs text-gray-600"></i>
                        </div>
                        <input type="text" id="form-add-cust-phone" class="flex-1 border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>

                <!-- Alamat -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Alamat</label>
                    <input type="text" id="form-add-cust-address" placeholder="Alamat" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <!-- Tipe Pelanggan -->
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Tipe Pelanggan</label>
                    <div class="relative">
                        <select id="form-add-cust-tier" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-bold text-gray-900 bg-white appearance-none focus:outline-none focus:border-emerald-600"></select>
                        <span class="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-700">
                            <i class="fa-solid fa-chevron-down text-xs"></i>
                        </span>
                    </div>
                </div>

                <!-- Tombol Simpan -->
                <div class="pt-3">
                    <button onclick="submitFormTambahPelangganManual()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                        SIMPAN
                    </button>
                </div>
            </div>
        </div>

        <!-- === 5. HALAMAN UTAMA TIPE PELANGGAN (SS 1000922850) === -->
        <div id="view-main-tipe-pelanggan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="switchView('pelanggan')" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Tipe Pelanggan</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-4">
                <!-- Kotak Cari Tipe Pelanggan -->
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="input-search-tipe-pelanggan" oninput="renderMainTipePelangganCards(this.value)" placeholder="Cari tipe pelanggan" class="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-full text-xs text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <!-- Banner Kuning Informasi Hak Akses -->
                <div class="bg-amber-50/90 border border-amber-200/80 rounded-xl p-3.5 flex items-center space-x-3">
                    <span class="w-6 h-6 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">i</span>
                    <p class="text-[11px] text-gray-800 leading-relaxed font-medium">
                        Aktifkan Hak akses Tipe Pelanggan untuk kesesuaian data laporan. <span onclick="alert('Hak akses Tipe Pelanggan sudah aktif di aplikasi ini.')" class="text-emerald-600 font-bold cursor-pointer hover:underline">Pelajari Selengkapnya</span>
                    </p>
                </div>

                <!-- Daftar Kartu Tipe Pelanggan (gold, dll.) -->
                <div id="container-main-tipe-pelanggan-cards" class="space-y-3"></div>
            </div>

            <!-- Tombol Sticky Bawah: TAMBAH TIPE PELANGGAN -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openAddTipePelangganScreen()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    TAMBAH TIPE PELANGGAN
                </button>
            </div>
        </div>

        <!-- === 6. HALAMAN TAMBAH TIPE PELANGGAN BARU (SS 1000922851) === -->
        <div id="view-add-tipe-pelanggan-screen" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeAddTipePelangganScreen()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Tipe Pelanggan</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-5">
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1.5">Tipe Pelanggan</label>
                    <input type="text" id="input-new-tier-screen-name" placeholder="Tipe Pelanggan" class="w-full border border-gray-300 p-3.5 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <button onclick="saveNewTipePelangganFromScreen()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-md transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>

                <!-- Ilustrasi Tengah (SS 1000922851) -->
                <div class="pt-12 text-center space-y-3">
                    <div class="w-36 h-36 mx-auto bg-slate-50 rounded-full flex flex-col items-center justify-center relative border border-slate-100 shadow-inner">
                        <div class="w-20 h-24 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div class="bg-emerald-600 h-10 p-2 space-y-1.5">
                                <div class="w-12 h-1 bg-white rounded"></div>
                                <div class="w-8 h-1 bg-white rounded"></div>
                            </div>
                            <div class="p-2 space-y-1.5">
                                <div class="w-10 h-1 bg-gray-200 rounded"></div>
                                <div class="w-12 h-1 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                        <div class="w-7 h-7 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs shadow-sm -mt-3">
                            <i class="fa-solid fa-hand-holding-heart"></i>
                        </div>
                    </div>
                    <h4 class="font-bold text-xs text-gray-900 pt-2">Belum ada data pelanggan</h4>
                    <p class="text-[11px] text-gray-500">Tipe Pelanggan belum tersedia, silakan menambahkan tipe pelanggan.</p>
                </div>
            </div>
        </div>

        <!-- === 7. HALAMAN EDIT TIPE PELANGGAN (SS 1000922852) === -->
        <div id="view-edit-tipe-pelanggan-screen" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeEditTipePelangganScreen()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Edit Tipe Pelanggan</h2>
                </div>
                <button onclick="deleteActiveEditingTier()" class="text-red-500 hover:text-red-700 text-xl p-1" title="Hapus Tipe Pelanggan">
                    <i class="fa-regular fa-trash-can"></i>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-5">
                <div>
                    <label class="block text-xs font-semibold text-gray-500 mb-1.5">Tipe Pelanggan</label>
                    <input type="text" id="input-edit-tier-screen-name" class="w-full border border-emerald-600 p-3.5 px-4 rounded-full text-xs font-bold text-gray-900 focus:outline-none">
                </div>

                <button onclick="saveEditTipePelangganFromScreen()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-md transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>

                <div class="flex justify-between items-center pt-2">
                    <span class="text-xs font-semibold text-gray-500">Pelanggan yang Dipilih</span>
                    <button onclick="openPickCustomerForTierView()" type="button" class="bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-xs px-4 py-2 rounded-lg flex items-center space-x-1.5 shadow-xs transition">
                        <i class="fa-solid fa-circle-plus text-gray-900"></i>
                        <span>Pelanggan</span>
                    </button>
                </div>

                <!-- Kotak Info Bulk Pelanggan -->
                <div class="bg-slate-50 border border-gray-200 rounded-xl p-3.5 flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-gray-200/80 text-emerald-700 flex items-center justify-center text-base flex-shrink-0">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <p class="text-[11px] text-gray-600 leading-relaxed">
                        <strong class="text-gray-900">Bulk Pelanggan</strong> atau memilih pelanggan secara massal dapat dilakukan langsung melalui tombol <strong class="text-emerald-700">+ Pelanggan</strong> di atas.
                    </p>
                </div>

                <!-- Daftar Pelanggan yang Terhubung di Tipe Ini -->
                <div id="container-edit-tier-customers-list" class="divide-y divide-gray-100"></div>
            </div>
        </div>

        <!-- === 8. HALAMAN PILIH PELANGGAN UNTUK TIPE PELANGGAN (SS 1000922853) === -->
        <div id="view-pick-cust-for-tier" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-2.5 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closePickCustomerForTierView()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <div>
                    <h2 class="text-sm font-bold text-gray-900">Pilih Pelanggan</h2>
                    <p class="text-xs text-gray-500 font-medium" id="subtitle-pick-cust-tier-name">gold</p>
                </div>
            </div>

            <div class="p-3 bg-white border-b flex items-center space-x-2">
                <button onclick="renderPickCustomerForTierList('')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-700"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-pick-cust-tier-search" oninput="renderPickCustomerForTierList(this.value)" placeholder="Nama, email atau no telp" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
                <button onclick="if(window.openScannerView) window.openScannerView('customer-list-search')" class="text-emerald-700 text-2xl px-2">
                    <i class="fa-solid fa-barcode"></i>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pb-28" id="container-pick-cust-tier-rows"></div>

            <div class="p-3 bg-white border-t absolute bottom-0 left-0 right-0 z-10 text-center space-y-2 shadow-lg">
                <span class="text-[11px] font-bold text-gray-800 block">Tambah Pelanggan</span>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="openContactPickerView('pelanggan')" type="button" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-full text-xs shadow-sm transition">
                        Dari Kontak
                    </button>
                    <button onclick="openFormTambahPelangganManual()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full text-xs shadow-sm transition">
                        Manual
                    </button>
                </div>
            </div>
        </div>

        <!-- === 9. HALAMAN DETAIL TIPE PELANGGAN (SS 1000922879) === -->
        <div id="view-detail-tipe-pelanggan-screen" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeDetailTipePelangganScreen()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Detail Tipe Pelanggan</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-4">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-500"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="input-detail-tier-cust-search" oninput="renderDetailTipePelangganCustomers(this.value)" placeholder="Cari Pelanggan" class="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-full text-xs text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <!-- Kartu Hijau Bergelombang (SS 1000922879) -->
                <div class="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 text-white rounded-2xl p-5 shadow-md space-y-1.5 relative overflow-hidden">
                    <h3 class="font-extrabold text-sm tracking-wide" id="det-tier-card-name">gold</h3>
                    <p class="text-xs text-emerald-50 font-semibold">Jumlah Pelanggan</p>
                    <p class="text-lg font-extrabold pt-0.5" id="det-tier-card-count">1</p>
                </div>

                <!-- Daftar Nama Pelanggan di Tipe Ini -->
                <div id="container-detail-tier-cust-rows" class="divide-y divide-gray-100 pt-1"></div>
            </div>

            <!-- Tombol Sticky Bawah: EDIT TIPE PELANGGAN -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openEditTipePelangganFromDetail()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    EDIT TIPE PELANGGAN
                </button>
            </div>
        </div>

        <!-- === 10. HALAMAN DAFTAR SUPPLIER (SS 1000922882) === -->
        <div id="view-main-supplier-list" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-3">
                    <button onclick="switchView('pelanggan')" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Supplier</h2>
                </div>
                <!-- Ikon 2 Panah Melingkar -> Halaman Sinkronisasi Cloud (SS 1000922888) -->
                <button onclick="openCloudSyncView()" class="text-emerald-600 hover:text-emerald-800 text-lg p-1 transition" title="Sinkronisasi Data Cloud">
                    <i class="fa-solid fa-arrows-rotate"></i>
                </button>
            </div>

            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20">
                <button onclick="toggleMainSupplierSortOrder()" class="text-emerald-700 text-xl px-2 py-1" title="Urutkan Supplier">
                    <i class="fa-solid fa-arrow-up-wide-short"></i>
                </button>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-700"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-main-supplier-search" oninput="renderMainSupplierList(this.value)" placeholder="Nama, email atau no telp" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pb-28" id="container-main-supplier-rows"></div>

            <!-- Panel Sticky Bawah: Tambah Supplier (Dari Kontak & Manual) -->
            <div class="p-3 bg-white border-t absolute bottom-0 left-0 right-0 z-10 text-center space-y-2 shadow-lg">
                <span class="text-[11px] font-bold text-gray-800 block">Tambah Supplier</span>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="openContactPickerView('supplier')" type="button" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-full text-xs shadow-sm transition active:scale-95">
                        Dari Kontak
                    </button>
                    <button onclick="openFormTambahSupplierManual()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full text-xs shadow-sm transition active:scale-95">
                        Manual
                    </button>
                </div>
            </div>
        </div>

        <!-- === 11. HALAMAN FORM TAMBAH SUPPLIER MANUAL (SS 1000922883) === -->
        <div id="view-form-tambah-supplier" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white flex items-center justify-between z-10">
                <button onclick="closeFormTambahSupplierManual()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                <div></div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 space-y-4 pb-28">
                <div class="flex flex-col items-center justify-center border-b pb-5">
                    <div class="relative flex items-center justify-center">
                        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-emerald-700 text-6xl shadow-inner overflow-hidden">
                            <i class="fa-solid fa-user mt-4"></i>
                        </div>
                        <button onclick="if(window.openLivePhotoCamera) window.openLivePhotoCamera('supplier')" type="button" class="absolute -right-10 bottom-2 text-emerald-600 text-xl p-1">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                    </div>
                    <h3 class="font-bold text-base text-gray-900 mt-3">Tambah Supplier</h3>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Nama</label>
                    <input type="text" id="form-add-sup-name" placeholder="Nama" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                    <input type="email" id="form-add-sup-email" placeholder="Email" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Telepon</label>
                    <div class="border border-gray-300 rounded-full flex items-center px-4 py-1">
                        <span class="text-sm font-semibold text-gray-900 pr-2 flex items-center"><span>+62</span><i class="fa-solid fa-caret-down text-xs text-gray-500 ml-1"></i></span>
                        <input type="text" id="form-add-sup-phone" class="flex-1 p-2 text-xs font-semibold text-gray-900 focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1">Alamat</label>
                    <input type="text" id="form-add-sup-address" placeholder="Alamat" class="w-full border border-gray-300 p-3 px-4 rounded-full text-xs font-semibold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>

                <div class="pt-3">
                    <button onclick="submitFormTambahSupplierManual()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-md transition active:scale-95 text-xs uppercase tracking-wider">
                        SIMPAN
                    </button>
                </div>
            </div>
        </div>

        <!-- === 12. HALAMAN CLOUD TO DEVICE DATA SYNCHRONIZATION (SS 1000922888) === -->
        <div id="view-cloud-sync" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-4 shadow-sm z-10">
                <button onclick="closeCloudSyncView()" class="text-gray-600 text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-sm font-bold text-emerald-700">Cloud to Device Data Synchronization</h2>
            </div>

            <div class="px-4 py-3 border-b bg-white">
                <p class="text-xs text-gray-500 font-medium">Fitur ini akan mengambil data dari cloud ke device.</p>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-100" id="container-cloud-sync-rows"></div>
        </div>
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    // ========================================================================
    // 3. DATA KONTAK HP & TRANSAKSI SUPPLIER SESUAI SCREENSHOT
    // ========================================================================
    const phoneBookContacts = [
        { name: "+62 812-3367-7719", sub: "+6281233677719", rawPhone: "81233677719" },
        { name: "+62 821-4758-8319", sub: "+6282147588319", rawPhone: "82147588319" },
        { name: "+62 821-9011-9511", sub: "+62 821-9011-9511", rawPhone: "82190119511" },
        { name: "+62 821-9011-9511", sub: "+6282190119511", rawPhone: "82190119511" },
        { name: "+62 857-5535-2308", sub: "+6285755352308", rawPhone: "85755352308" },
        { name: ". rido", sub: "+62 812-3223-9223", rawPhone: "81232239223" },
        { name: ".Choiroh Lamaran", sub: "+6285846354975", rawPhone: "85846354975" },
        { name: ".RB2 Tas Kertas Jombang", sub: "+6281554439021", rawPhone: "81554439021" },
        { name: "081333122999", sub: "081333122999", rawPhone: "81333122999" },
        { name: "2Rior team", sub: "+62 821-1189-5460", rawPhone: "82111895460" },
        { name: "2Rior team", sub: "+6282111895460", rawPhone: "82111895460" },
        { name: "3n1 md esports", sub: "+62 896-7450-8812", rawPhone: "89674508812" }
    ];

    // Riwayat Transaksi Khusus Supplier 'Bu (amplop,valentine)' (SS 1000922886 & 1000922887)
    const buAmplopTransactions = [
        {
            id: "16356320220808173558",
            receiptId: "151374420261008081132",
            dateStr: "2026-10-08",
            day: "08",
            monthYear: "Okt 2026",
            time: "08:11:32",
            pengeluaran: 169000.08,
            admin: "Adm",
            vendorShort: "Bu (amplop",
            items: [
                { name: "Kapas BB 100gr", qty: 2, unit: "slop", price: 50000.04, total: 100000.08 },
                { name: "Kapas Selection", qty: 1, unit: "slop", price: 69000, total: 69000 }
            ]
        },
        { id: "16356320220808173558", receiptId: "151374420260924082551", dateStr: "2026-09-24", day: "24", monthYear: "Sep 2026", time: "08:25:51", pengeluaran: 307000.08, admin: "Adm", vendorShort: "Bu (amplop", items: [{ name: "Amplop Putih Panjang", qty: 12, unit: "pak", price: 25583.34, total: 307000.08 }] },
        { id: "16356320220808173558", receiptId: "151374420260910085314", dateStr: "2026-09-10", day: "10", monthYear: "Sep 2026", time: "08:53:14", pengeluaran: 240000, admin: "Adm", vendorShort: "Bu (amplop", items: [{ name: "Kertas Kado Valentine", qty: 20, unit: "pak", price: 12000, total: 240000 }] },
        { id: "16356320220808173558", receiptId: "151374420260827135403", dateStr: "2026-08-27", day: "27", monthYear: "Aug 2026", time: "13:54:03", pengeluaran: 168000, admin: "Adm", vendorShort: "Bu (amplop", items: [{ name: "Amplop Coklat Folio", qty: 8, unit: "pak", price: 21000, total: 168000 }] },
        { id: "16356320220808173558", receiptId: "151374420260813102816", dateStr: "2026-08-13", day: "13", monthYear: "Aug 2026", time: "10:28:16", pengeluaran: 250500, admin: "Adm", vendorShort: "Bu (amplop", items: [{ name: "Kapas Selection", qty: 5, unit: "slop", price: 50100, total: 250500 }] },
        { id: "16356320220808173558", receiptId: "151374420260806092251", dateStr: "2026-08-06", day: "06", monthYear: "Aug 2026", time: "09:22:51", pengeluaran: 211500, admin: "Adm", vendorShort: "Bu (amplop", items: [{ name: "Amplop Merpati", qty: 9, unit: "box", price: 23500, total: 211500 }] },
        { id: "16356320220808173558", receiptId: "151374420260716103826", dateStr: "2026-07-16", day: "16", monthYear: "Jul 2026", time: "10:38:26", pengeluaran: 207000, admin: "Adm", vendorShort: "Bu (amplop", items: [{ name: "Kapas BB 100gr", qty: 3, unit: "slop", price: 69000, total: 207000 }] },
        { id: "16356320220808173558", receiptId: "151374420260709120653", dateStr: "2026-07-09", day: "09", monthYear: "Jul 2026", time: "12:06:53", pengeluaran: 250000.2, admin: "Adm", vendorShort: "Bu (amplop", items: [{ name: "Amplop Kabinet", qty: 10, unit: "box", price: 25000.02, total: 250000.2 }] },
        { id: "16356320220808173558", receiptId: "151374420260625095723", dateStr: "2026-06-25", day: "25", monthYear: "Jun 2026", time: "09:57:23", pengeluaran: 200000.16, admin: "Adm", vendorShort: "Bu (amplop", items: [{ name: "Amplop Putih 104", qty: 12, unit: "box", price: 16666.68, total: 200000.16 }] },
        { id: "16356320220808173558", receiptId: "151374420260604085834", dateStr: "2026-06-04", day: "04", monthYear: "Jun 2026", time: "08:58:34", pengeluaran: 232502.4, admin: "Adm", vendorShort: "Bu (amplop", items: [{ name: "Kertas Bungkus Valentine", qty: 15, unit: "pak", price: 15500.16, total: 232502.4 }] },
        { id: "16356320220808173558", receiptId: "151374420260528085156", dateStr: "2026-05-28", day: "28", monthYear: "May 2026", time: "08:51:56", pengeluaran: 300000, admin: "Adm", vendorShort: "Bu (amplop", items: [{ name: "Paket Amplop & Kapas", qty: 6, unit: "pak", price: 50000, total: 300000 }] }
    ];

    // Pastikan pelanggan '011 P Budi Mantung' ada di daftar (SS 1000922853)
    if (window.customersList && !window.customersList.some(c => c.name.includes('011 P Budi Mantung'))) {
        window.customersList.push({
            id: "cust_011",
            avatarCode: "01",
            name: "011 P Budi Mantung",
            code: "121",
            points: 27097,
            tier: "-",
            phone: "81230011",
            address: "Mantung",
            piutangList: []
        });
    }

    // Pastikan supplier 'Bu (amplop,valentine)' memiliki data sesuai SS 1000922884
    if (window.suppliersList) {
        const buSup = window.suppliersList.find(s => s.id === 'sup_bu' || s.name.includes('Bu (amplop'));
        if (buSup) {
            buSup.phone = "85";
            buSup.address = "";
            buSup.debtCount = 1;
            buSup.debtAmount = 0;
            buSup.trxCount = 85;
            buSup.debts = [];
        }
    }

    // Pastikan masterCustomerTypes diinisialisasi dengan 'gold' seperti SS 1000922850
    if (!localStorage.getItem('pos_customer_tiers_initialized')) {
        window.masterCustomerTypes = ["gold"];
        localStorage.setItem('pos_customer_tiers_initialized', 'true');
    }

    // State Navigasi & Mode
    let mainPelangganSortBy = 'name'; // 'name', 'email', 'trx'
    let mainSupplierSortAsc = true;
    let contactPickerTarget = 'pelanggan'; // 'pelanggan' atau 'supplier'
    let activeTierName = 'gold';
    let openedCustProfileFromMainPelanggan = false;
    let openedSupDetailFromMainSupplier = false;

    // Hook pada switchView('pelanggan') agar header utama disembunyikan
    const prevSwitchView = window.switchView;
    window.switchView = function(viewName) {
        if (typeof prevSwitchView === 'function') prevSwitchView(viewName);
        if (viewName === 'pelanggan') {
            const mainHeader = document.getElementById('main-header');
            if (mainHeader) mainHeader.classList.add('hidden');
        }
    };

    // Sambungkan tombol kembali dari Profil Pelanggan & Detail Supplier
    const prevBackCust = window.backFromCustomerProfile;
    window.backFromCustomerProfile = () => {
        if (openedCustProfileFromMainPelanggan) {
            openedCustProfileFromMainPelanggan = false;
            document.getElementById('view-customer-profile').classList.add('hidden');
            document.getElementById('view-main-pelanggan-list').classList.remove('hidden');
            window.renderMainPelangganList(document.getElementById('input-main-pelanggan-search')?.value || '');
        } else if (typeof prevBackCust === 'function') {
            prevBackCust();
        }
    };

    const prevBackSup = window.backFromSupplierDetail;
    window.backFromSupplierDetail = () => {
        if (openedSupDetailFromMainSupplier) {
            openedSupDetailFromMainSupplier = false;
            document.getElementById('view-supplier-detail').classList.add('hidden');
            document.getElementById('view-main-supplier-list').classList.remove('hidden');
            window.renderMainSupplierList(document.getElementById('input-main-supplier-search')?.value || '');
        } else if (typeof prevBackSup === 'function') {
            prevBackSup();
        }
    };

    // ========================================================================
    // 4. LOGIKA MENU 1: PELANGGAN & KONTAK (SS 1000922844 - 1000922849)
    // ========================================================================
    window.openMainPelangganListView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-main-pelanggan-list').classList.remove('hidden');
        document.getElementById('input-main-pelanggan-search').value = '';
        window.renderMainPelangganList('');
    };

    window.toggleMainPelangganSortDropdown = () => {
        document.getElementById('dropdown-main-pelanggan-sort').classList.toggle('hidden');
    };
    window.hideMainPelangganSortDropdown = () => {
        const el = document.getElementById('dropdown-main-pelanggan-sort');
        if (el) el.classList.add('hidden');
    };
    window.applyMainPelangganSort = (mode) => {
        mainPelangganSortBy = mode;
        window.hideMainPelangganSortDropdown();
        window.renderMainPelangganList(document.getElementById('input-main-pelanggan-search').value);
    };

    window.renderMainPelangganList = function(keyword = '') {
        const container = document.getElementById('container-main-pelanggan-rows');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        // Prioritaskan urutan 001 - 010 seperti SS 1000922844
        let list = [...(window.customersList || [])].filter(c => {
            if (!k && (c.id === 'cust_mbg' || c.id === 'cust_198' || c.id === 'cust_065' || c.id === 'cust_216' || c.id === 'cust_274' || c.id === 'cust_042')) {
                return false; // Disembunyikan saat tampilan default agar sama persis dengan urutan 001-011 di SS 1000922844
            }
            return (c.name || '').toLowerCase().includes(k) ||
                   (c.email || '').toLowerCase().includes(k) ||
                   (c.phone || '').toLowerCase().includes(k) ||
                   (c.code || '').toLowerCase().includes(k);
        });

        list.sort((a, b) => {
            if (mainPelangganSortBy === 'email') return (a.email || '').localeCompare(b.email || '');
            if (mainPelangganSortBy === 'trx') return (Number(b.trxCount) || 0) - (Number(a.trxCount) || 0);
            return (a.name || '').localeCompare(b.name || '');
        });

        list.forEach(c => {
            const tierBadge = c.tier && c.tier !== '-'
                ? `<span class="inline-flex items-center"><span class="w-2.5 h-2.5 rounded-full bg-gray-300 mx-2"></span><span>${c.tier}</span></span>`
                : '';

            container.innerHTML += `
                <div onclick="openCustomerProfileFromMainList('${c.id}')" class="p-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-center space-x-3.5 min-w-0 pr-3">
                        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm flex-shrink-0">
                            ${c.avatarCode || c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-xs text-gray-900 truncate">${c.name}</h4>
                            <p class="text-[11px] text-gray-500 font-semibold mt-0.5 flex items-center">
                                <span>${c.code || '85'}</span>${tierBadge}
                            </p>
                        </div>
                    </div>
                    <span class="text-xs font-bold text-emerald-600 flex-shrink-0">${c.points || 0} Poin</span>
                </div>
            `;
        });
    };

    window.openCustomerProfileFromMainList = (custId) => {
        openedCustProfileFromMainPelanggan = true;
        if (window.openCustomerProfileView) {
            window.openCustomerProfileView(custId);
        }
    };

    // --- HALAMAN DARI KONTAK TELEPON (SS 1000922846) ---
    window.openContactPickerView = (target = 'pelanggan') => {
        contactPickerTarget = target;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-contact-picker').classList.remove('hidden');

        const titleEl = document.getElementById('contact-picker-header-title');
        const btnManual = document.getElementById('btn-contact-picker-manual');
        if (target === 'supplier') {
            titleEl.innerText = "Tambah Supplier";
            btnManual.innerText = "Tambah Supplier Manual";
        } else {
            titleEl.innerText = "Tambah Pelanggan";
            btnManual.innerText = "Tambah Pelanggan Manual";
        }

        document.getElementById('input-contact-picker-search').value = '';
        window.renderContactPickerList('');
    };

    window.closeContactPickerView = () => {
        document.getElementById('view-contact-picker').classList.add('hidden');
        if (contactPickerTarget === 'supplier') {
            document.getElementById('view-main-supplier-list').classList.remove('hidden');
        } else {
            document.getElementById('view-main-pelanggan-list').classList.remove('hidden');
        }
    };

    window.openManualFormFromContactPicker = () => {
        if (contactPickerTarget === 'supplier') {
            window.openFormTambahSupplierManual();
        } else {
            window.openFormTambahPelangganManual();
        }
    };

    window.renderContactPickerList = function(keyword = '') {
        const container = document.getElementById('container-contact-picker-rows');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        const filtered = phoneBookContacts.filter(ct =>
            ct.name.toLowerCase().includes(k) || ct.sub.toLowerCase().includes(k)
        );

        filtered.forEach((ct, idx) => {
            container.innerHTML += `
                <div onclick="selectPhoneBookContact(${idx})" class="px-4 py-3.5 bg-white hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <h4 class="font-bold text-xs text-gray-900">${ct.name}</h4>
                    <p class="text-[11px] text-gray-500 mt-0.5">${ct.sub}</p>
                </div>
            `;
        });
    };

    window.selectPhoneBookContact = (idx) => {
        const ct = phoneBookContacts[idx];
        if (!ct) return;

        if (contactPickerTarget === 'supplier') {
            window.openFormTambahSupplierManual(ct.name, ct.rawPhone);
        } else {
            window.openFormTambahPelangganManual(ct.name, ct.rawPhone);
        }
    };

    // --- FORM TAMBAH PELANGGAN MANUAL (SS 1000922849) ---
    window.openFormTambahPelangganManual = (prefillName = '', prefillPhone = '') => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-form-tambah-pelanggan').classList.remove('hidden');

        document.getElementById('form-add-cust-name').value = prefillName;
        document.getElementById('form-add-cust-points').value = '0';
        document.getElementById('form-add-cust-code').value = '';
        document.getElementById('chk-auto-cust-code').checked = false;
        document.getElementById('form-add-cust-email').value = '';
        document.getElementById('form-add-cust-phone').value = prefillPhone;
        document.getElementById('form-add-cust-address').value = '';

        const tierSel = document.getElementById('form-add-cust-tier');
        tierSel.innerHTML = `<option value="-">Pilih Tipe Pelanggan</option>`;
        (window.masterCustomerTypes || ['gold']).forEach(t => {
            tierSel.innerHTML += `<option value="${t}">${t}</option>`;
        });
    };

    window.closeFormTambahPelangganManual = () => {
        document.getElementById('view-form-tambah-pelanggan').classList.add('hidden');
        document.getElementById('view-main-pelanggan-list').classList.remove('hidden');
    };

    window.toggleAutoCustomerCode = (checked) => {
        const codeInput = document.getElementById('form-add-cust-code');
        if (checked) {
            const nextNum = (window.customersList?.length || 11) + 1;
            codeInput.value = `PLG-${nextNum.toString().padStart(4, '0')}`;
        } else {
            codeInput.value = '';
        }
    };

    window.submitFormTambahPelangganManual = () => {
        const name = document.getElementById('form-add-cust-name').value.trim();
        const points = Number(document.getElementById('form-add-cust-points').value) || 0;
        const code = document.getElementById('form-add-cust-code').value.trim() || '85';
        const email = document.getElementById('form-add-cust-email').value.trim();
        const phone = document.getElementById('form-add-cust-phone').value.trim();
        const address = document.getElementById('form-add-cust-address').value.trim();
        const tier = document.getElementById('form-add-cust-tier').value;

        if (!name) return alert("Nama Panggilan pelanggan wajib diisi!");

        const newCust = {
            id: 'cust_' + Date.now(),
            avatarCode: name.substring(0, 2).toUpperCase(),
            name,
            code,
            points,
            relatedDisplayPoints: 0,
            tier,
            email,
            phone,
            address,
            debtCount: 0,
            debtTotal: 0,
            trxCount: 0,
            totalProfit: 0,
            totalRevenue: 0,
            pointLogs: [],
            piutangList: []
        };

        window.customersList.unshift(newCust);
        alert("Data pelanggan berhasil disimpan!");
        window.closeFormTambahPelangganManual();
        window.renderMainPelangganList('');
    };

    // ========================================================================
    // 5. LOGIKA MENU 2: TIPE PELANGGAN (SS 1000922850 - 1000922879)
    // ========================================================================
    window.openMainTipePelangganView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-main-tipe-pelanggan').classList.remove('hidden');
        document.getElementById('input-search-tipe-pelanggan').value = '';
        window.renderMainTipePelangganCards('');
    };

    window.renderMainTipePelangganCards = function(keyword = '') {
        const container = document.getElementById('container-main-tipe-pelanggan-cards');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        const list = (window.masterCustomerTypes || ['gold']).filter(t => t.toLowerCase().includes(k));

        if (list.length === 0) {
            container.innerHTML = `<div class="py-12 text-center text-xs text-gray-400 font-semibold">Tipe pelanggan tidak ditemukan.</div>`;
            return;
        }

        list.forEach(tier => {
            const countCust = (window.customersList || []).filter(c => (c.tier || '').toLowerCase() === tier.toLowerCase()).length;

            container.innerHTML += `
                <div class="border border-gray-300 rounded-xl bg-white overflow-hidden shadow-2xs">
                    <div class="p-4 space-y-1.5">
                        <h4 class="font-extrabold text-xs text-gray-900">${tier}</h4>
                        <div class="flex justify-between items-center text-xs">
                            <span class="text-gray-500 font-medium">Jumlah Pelanggan</span>
                            <span class="font-bold text-gray-900">${countCust}</span>
                        </div>
                    </div>
                    <div class="border-t border-gray-200 px-4 py-2.5 flex justify-between items-center text-xs font-bold text-emerald-600 bg-white">
                        <button onclick="openEditTipePelangganScreen('${tier}')" type="button" class="flex items-center space-x-2 hover:text-emerald-800 transition">
                            <span>Edit</span>
                            <i class="fa-solid fa-pen text-sm"></i>
                        </button>
                        <button onclick="openDetailTipePelangganScreen('${tier}')" type="button" class="flex items-center space-x-2 hover:text-emerald-800 transition">
                            <span>Rincian</span>
                            <i class="fa-solid fa-arrow-right text-sm"></i>
                        </button>
                    </div>
                </div>
            `;
        });
    };

    // --- TAMBAH TIPE PELANGGAN BARU (SS 1000922851) ---
    window.openAddTipePelangganScreen = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-add-tipe-pelanggan-screen').classList.remove('hidden');
        document.getElementById('input-new-tier-screen-name').value = '';
    };

    window.closeAddTipePelangganScreen = () => {
        document.getElementById('view-add-tipe-pelanggan-screen').classList.add('hidden');
        document.getElementById('view-main-tipe-pelanggan').classList.remove('hidden');
        window.renderMainTipePelangganCards('');
    };

    window.saveNewTipePelangganFromScreen = () => {
        const name = document.getElementById('input-new-tier-screen-name').value.trim();
        if (!name) return alert("Masukkan nama Tipe Pelanggan terlebih dahulu!");

        if (!window.masterCustomerTypes) window.masterCustomerTypes = [];
        if (!window.masterCustomerTypes.some(t => t.toLowerCase() === name.toLowerCase())) {
            window.masterCustomerTypes.push(name);
        }

        window.closeAddTipePelangganScreen();
    };

    // --- EDIT TIPE PELANGGAN & + PELANGGAN (SS 1000922852 & 1000922853) ---
    window.openEditTipePelangganScreen = (tierName) => {
        activeTierName = tierName;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-edit-tipe-pelanggan-screen').classList.remove('hidden');
        document.getElementById('input-edit-tier-screen-name').value = tierName;
        renderEditTierSelectedCustomers();
    };

    window.closeEditTipePelangganScreen = () => {
        document.getElementById('view-edit-tipe-pelanggan-screen').classList.add('hidden');
        document.getElementById('view-main-tipe-pelanggan').classList.remove('hidden');
        window.renderMainTipePelangganCards('');
    };

    function renderEditTierSelectedCustomers() {
        const container = document.getElementById('container-edit-tier-customers-list');
        if (!container) return;
        container.innerHTML = '';

        const members = (window.customersList || []).filter(c => (c.tier || '').toLowerCase() === activeTierName.toLowerCase());

        members.forEach(m => {
            container.innerHTML += `
                <div class="py-3.5 flex justify-between items-center text-xs">
                    <span class="font-extrabold text-gray-900">${m.name}</span>
                    <button onclick="removeCustomerFromTier('${m.id}')" type="button" class="text-red-500 hover:text-red-700 text-lg px-1" title="Hapus dari Tipe Ini">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
            `;
        });
    }

    window.removeCustomerFromTier = (custId) => {
        const c = (window.customersList || []).find(x => x.id === custId);
        if (c) {
            c.tier = '-';
            renderEditTierSelectedCustomers();
        }
    };

    window.saveEditTipePelangganFromScreen = () => {
        const newName = document.getElementById('input-edit-tier-screen-name').value.trim();
        if (!newName) return alert("Nama Tipe Pelanggan tidak boleh kosong!");

        const idx = (window.masterCustomerTypes || []).findIndex(t => t.toLowerCase() === activeTierName.toLowerCase());
        if (idx >= 0) window.masterCustomerTypes[idx] = newName;

        (window.customersList || []).forEach(c => {
            if ((c.tier || '').toLowerCase() === activeTierName.toLowerCase()) {
                c.tier = newName;
            }
        });

        activeTierName = newName;
        alert("Perubahan Tipe Pelanggan berhasil disimpan!");
        window.closeEditTipePelangganScreen();
    };

    window.deleteActiveEditingTier = () => {
        if (!confirm(`Yakin ingin menghapus Tipe Pelanggan '${activeTierName}'?`)) return;
        window.masterCustomerTypes = (window.masterCustomerTypes || []).filter(t => t.toLowerCase() !== activeTierName.toLowerCase());
        (window.customersList || []).forEach(c => {
            if ((c.tier || '').toLowerCase() === activeTierName.toLowerCase()) c.tier = '-';
        });
        window.closeEditTipePelangganScreen();
    };

    // Pilih Pelanggan untuk dimasukkan ke Tipe Pelanggan (SS 1000922853)
    window.openPickCustomerForTierView = () => {
        document.getElementById('view-edit-tipe-pelanggan-screen').classList.add('hidden');
        document.getElementById('view-pick-cust-for-tier').classList.remove('hidden');
        document.getElementById('subtitle-pick-cust-tier-name').innerText = activeTierName;
        document.getElementById('input-pick-cust-tier-search').value = '';
        window.renderPickCustomerForTierList('');
    };

    window.closePickCustomerForTierView = () => {
        document.getElementById('view-pick-cust-for-tier').classList.add('hidden');
        document.getElementById('view-edit-tipe-pelanggan-screen').classList.remove('hidden');
        renderEditTierSelectedCustomers();
    };

    window.renderPickCustomerForTierList = function(keyword = '') {
        const container = document.getElementById('container-pick-cust-tier-rows');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        // Tampilkan pelanggan yang belum masuk di tipe ini (seperti 002 - 011 di SS 1000922853)
        let list = (window.customersList || []).filter(c => {
            if ((c.tier || '').toLowerCase() === activeTierName.toLowerCase()) return false;
            if (!k && (c.id === 'cust_mbg' || c.id === 'cust_198' || c.id === 'cust_065' || c.id === 'cust_216' || c.id === 'cust_274' || c.id === 'cust_042')) {
                return false;
            }
            return (c.name || '').toLowerCase().includes(k) ||
                   (c.code || '').toLowerCase().includes(k) ||
                   (c.phone || '').toLowerCase().includes(k);
        });

        list.sort((a, b) => a.name.localeCompare(b.name));

        list.forEach(c => {
            container.innerHTML += `
                <div onclick="assignCustomerToActiveTier('${c.id}')" class="p-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-center space-x-3.5 min-w-0 pr-3">
                        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm flex-shrink-0">
                            ${c.avatarCode || '00'}
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-xs text-gray-900 truncate">${c.name}</h4>
                            <p class="text-[11px] text-gray-500 font-semibold mt-0.5">${c.code || '85'}</p>
                        </div>
                    </div>
                    <span class="text-xs font-bold text-emerald-600 flex-shrink-0">${c.points || 0} Poin</span>
                </div>
            `;
        });
    };

    window.assignCustomerToActiveTier = (custId) => {
        const c = (window.customersList || []).find(x => x.id === custId);
        if (c) {
            c.tier = activeTierName;
        }
        window.closePickCustomerForTierView();
    };

    // --- DETAIL TIPE PELANGGAN (SS 1000922879) ---
    window.openDetailTipePelangganScreen = (tierName) => {
        activeTierName = tierName;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-detail-tipe-pelanggan-screen').classList.remove('hidden');
        document.getElementById('input-detail-tier-cust-search').value = '';
        window.renderDetailTipePelangganCustomers('');
    };

    window.closeDetailTipePelangganScreen = () => {
        document.getElementById('view-detail-tipe-pelanggan-screen').classList.add('hidden');
        document.getElementById('view-main-tipe-pelanggan').classList.remove('hidden');
        window.renderMainTipePelangganCards('');
    };

    window.renderDetailTipePelangganCustomers = function(keyword = '') {
        const members = (window.customersList || []).filter(c => (c.tier || '').toLowerCase() === activeTierName.toLowerCase());
        document.getElementById('det-tier-card-name').innerText = activeTierName;
        document.getElementById('det-tier-card-count').innerText = members.length;

        const container = document.getElementById('container-detail-tier-cust-rows');
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        const filtered = members.filter(m => m.name.toLowerCase().includes(k));

        filtered.forEach(m => {
            container.innerHTML += `
                <div onclick="openCustomerProfileFromMainList('${m.id}')" class="py-3.5 text-xs font-extrabold text-gray-900 cursor-pointer hover:text-emerald-700 transition">
                    ${m.name}
                </div>
            `;
        });
    };

    window.openEditTipePelangganFromDetail = () => {
        window.openEditTipePelangganScreen(activeTierName);
    };

    // ========================================================================
    // 6. LOGIKA MENU 3: SUPPLIER & SINKRONISASI CLOUD (SS 1000922882 - 1000922888)
    // ========================================================================
    window.openMainSupplierListView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-main-supplier-list').classList.remove('hidden');
        document.getElementById('input-main-supplier-search').value = '';
        window.renderMainSupplierList('');
    };

    window.toggleMainSupplierSortOrder = () => {
        mainSupplierSortAsc = !mainSupplierSortAsc;
        window.renderMainSupplierList(document.getElementById('input-main-supplier-search').value);
    };

    window.renderMainSupplierList = function(keyword = '') {
        const container = document.getElementById('container-main-supplier-rows');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        const targetNamesOrder = [
            "Bu (amplop,valentine)", "Camel (dus)", "CV. MitraArtaSukses(SeeU)",
            "CV.Mekar (Huda HOK)", "Dus Lamaran (Batu)", "Eka Jaya (Rajut)",
            "Elok Abadi Sayur (waring)", "Energy (Rege)", "Felix Wijaya (TW)",
            "HendryPasman (TrashBag)"
        ];

        let list = [...(window.suppliersList || [])].filter(s => {
            if (!k && s.isCustomAdded !== true && !targetNamesOrder.includes(s.name)) {
                return false; // Tampilkan daftar supplier utama sesuai SS 1000922882
            }
            return (s.name || '').toLowerCase().includes(k) ||
                   (s.email || '').toLowerCase().includes(k) ||
                   (s.phone || '').toLowerCase().includes(k);
        });

        list.sort((a, b) => mainSupplierSortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

        list.forEach(s => {
            const initials = (s.avatarCode || s.name.substring(0, 2)).toUpperCase();
            container.innerHTML += `
                <div onclick="openSupplierDetailFromMainList('${s.id}')" class="p-4 bg-white flex items-center space-x-3.5 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        <span class="text-slate-400">${initials}</span>
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="font-bold text-xs text-gray-900 truncate">${s.name}</h4>
                        <p class="text-[11px] text-gray-500 truncate mt-0.5">${s.email || '-'}</p>
                    </div>
                </div>
            `;
        });
    };

    window.openSupplierDetailFromMainList = (supId) => {
        openedSupDetailFromMainSupplier = true;
        const s = (window.suppliersList || []).find(x => x.id === supId);

        // Jika membuka 'Bu (amplop,valentine)', pasang riwayat transaksi & struk sesuai SS 1000922886 & 1000922887
        if (s && s.name.includes('Bu (amplop')) {
            window.supplierPurchaseHistory = [...buAmplopTransactions];
        }

        if (window.openSupplierDetailView) {
            window.openSupplierDetailView(supId);
            // Sesuaikan tampilan telepon '85' (tanpa +62 jika sudah pendek seperti di SS 1000922884)
            if (s && s.phone === '85') {
                const phoneEl = document.getElementById('prof-sup-phone');
                if (phoneEl) phoneEl.innerText = '85';
            }
        }
    };

    // --- FORM TAMBAH SUPPLIER MANUAL (SS 1000922883) ---
    window.openFormTambahSupplierManual = (prefillName = '', prefillPhone = '') => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-form-tambah-supplier').classList.remove('hidden');

        document.getElementById('form-add-sup-name').value = prefillName;
        document.getElementById('form-add-sup-email').value = '';
        document.getElementById('form-add-sup-phone').value = prefillPhone;
        document.getElementById('form-add-sup-address').value = '';
    };

    window.closeFormTambahSupplierManual = () => {
        document.getElementById('view-form-tambah-supplier').classList.add('hidden');
        document.getElementById('view-main-supplier-list').classList.remove('hidden');
    };

    window.submitFormTambahSupplierManual = () => {
        const name = document.getElementById('form-add-sup-name').value.trim();
        const email = document.getElementById('form-add-sup-email').value.trim() || '-';
        const phone = document.getElementById('form-add-sup-phone').value.trim() || '85';
        const address = document.getElementById('form-add-sup-address').value.trim();

        if (!name) return alert("Nama supplier wajib diisi!");

        const newSup = {
            id: 'sup_' + Date.now(),
            avatarCode: name.substring(0, 2).toUpperCase(),
            name,
            email,
            phone,
            address,
            debtCount: 0,
            debtAmount: 0,
            trxCount: 0,
            debts: [],
            isCustomAdded: true
        };

        window.suppliersList.unshift(newSup);
        alert("Data supplier berhasil disimpan!");
        window.closeFormTambahSupplierManual();
        window.renderMainSupplierList('');
    };

    // --- HALAMAN CLOUD TO DEVICE DATA SYNCHRONIZATION (SS 1000922888) ---
    const syncModulesList = [
        { key: 'manajemen', title: 'MANAJEMEN', type: 'sync', sub: '' },
        { key: 'kategori', title: 'KATEGORI', type: 'sync', sub: '' },
        { key: 'lap_jual', title: 'LAPORAN PENJUALAN & PEMASUKAN', type: 'arrow', sub: '' },
        { key: 'lap_beli', title: 'LAPORAN PEMBELIAN & PENGELUARAN', type: 'arrow', sub: '' },
        { key: 'pelanggan', title: 'PELANGGAN', type: 'sync', sub: '' },
        { key: 'tipe_pelanggan', title: 'TIPE PELANGGAN', type: 'sync', sub: '' },
        { key: 'supplier', title: 'SUPPLIER', type: 'sync', sub: '0 data' },
        { key: 'diskon', title: 'DISKON', type: 'sync', sub: '' },
        { key: 'pajak', title: 'PAJAK', type: 'sync', sub: '' },
        { key: 'biaya', title: 'BIAYA', type: 'sync', sub: '' },
        { key: 'staff', title: 'STAFF', type: 'sync', sub: '' },
        { key: 'shift', title: 'SHIFT', type: 'sync', sub: '' },
        { key: 'promosi', title: 'PROMOSI', type: 'sync', sub: '' },
        { key: 'gambar', title: 'GAMBAR PRODUK', type: 'sync', sub: '' }
    ];

    window.openCloudSyncView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-cloud-sync').classList.remove('hidden');
        renderCloudSyncRows();

        // Jalankan animasi sinkronisasi otomatis pada baris SUPPLIER selama 1.4 detik lalu kembali ke halaman Supplier
        setTimeout(() => {
            triggerSingleRowSync('supplier', true);
        }, 150);
    };

    window.closeCloudSyncView = () => {
        document.getElementById('view-cloud-sync').classList.add('hidden');
        document.getElementById('view-main-supplier-list').classList.remove('hidden');
        window.renderMainSupplierList('');
    };

    function renderCloudSyncRows() {
        const container = document.getElementById('container-cloud-sync-rows');
        if (!container) return;
        container.innerHTML = '';

        syncModulesList.forEach(item => {
            const btnIcon = item.type === 'arrow'
                ? `<i class="fa-solid fa-chevron-right text-sm"></i>`
                : `<i id="sync-icon-${item.key}" class="fa-solid fa-arrows-rotate text-sm"></i>`;

            container.innerHTML += `
                <div class="px-4 py-3 bg-white flex items-center justify-between">
                    <div class="flex-1 pr-4">
                        <h4 class="font-extrabold text-[11px] text-gray-900 tracking-wide uppercase">${item.title}</h4>
                        <div class="flex items-center space-x-2 mt-2">
                            <div class="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                                <div id="sync-bar-${item.key}" class="bg-emerald-500 h-full w-0 transition-all duration-700"></div>
                            </div>
                            ${item.sub ? `<span id="sync-sub-${item.key}" class="text-[9px] font-bold text-gray-700 whitespace-nowrap">${item.sub}</span>` : ''}
                        </div>
                    </div>
                    <button onclick="triggerSingleRowSync('${item.key}', false)" type="button" class="w-10 h-10 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xs flex-shrink-0 transition active:scale-95">
                        ${btnIcon}
                    </button>
                </div>
            `;
        });
    }

    window.triggerSingleRowSync = (key, autoReturn = false) => {
        const bar = document.getElementById(`sync-bar-${key}`);
        const icon = document.getElementById(`sync-icon-${key}`);
        const sub = document.getElementById(`sync-sub-${key}`);

        if (icon) icon.classList.add('fa-spin');
        if (bar) bar.style.width = '100%';

        setTimeout(() => {
            if (icon) icon.classList.remove('fa-spin');
            if (sub && key === 'supplier') {
                sub.innerText = `${(window.suppliersList || []).length} data`;
            }
            if (autoReturn) {
                setTimeout(() => {
                    // Jika pengguna masih di layar sinkronisasi, otomatis kembali ke daftar supplier setelah selesai
                    const syncView = document.getElementById('view-cloud-sync');
                    if (syncView && !syncView.classList.contains('hidden')) {
                        window.closeCloudSyncView();
                    }
                }, 500);
            }
        }, 900);
    };
})();
