// ============================================================================
// MODUL 8: MANAJEMEN HUTANG & PIUTANG - BAGIAN 2 (ALUR LENGKAP HUTANG SUPPLIER)
// ============================================================================

(function() {
    // 1. HAPUS PLACEHOLDER HUTANG SUPPLIER LAMA AGAR DIGANTIKAN VERSI PENUH INI
    const oldSupHutangView = document.getElementById('view-supplier-hutang');
    if (oldSupHutangView) oldSupHutangView.remove();

    // 2. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN DAFTAR UTAMA HUTANG (SS 1000922682) === -->
        <div id="view-hutang-main" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="switchView('debts')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Hutang</h2>
            </div>

            <!-- Baris Sortir, Pencarian Nama, & Filter Jatuh Tempo -->
            <div class="p-3 bg-white flex items-center space-x-2 relative z-20">
                <div class="relative">
                    <button onclick="toggleHutangMainSortMenu()" class="text-emerald-700 text-xl px-2 py-1 focus:outline-none">
                        <i class="fa-solid fa-arrow-up-wide-short"></i>
                    </button>
                    <div id="dropdown-hutang-main-sort" class="absolute left-0 top-10 w-52 bg-white rounded-md shadow-2xl border border-gray-200 py-1 hidden z-50 text-xs font-medium text-gray-900">
                        <button onclick="applyHutangMainSort('due')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Jatuh Tempo Terdekat</button>
                        <button onclick="applyHutangMainSort('name')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Nama</button>
                        <button onclick="applyHutangMainSort('latest')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Transaksi Terbaru</button>
                    </div>
                </div>

                <!-- Kotak Cari Nama Supplier -->
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-700"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="hutang-main-search" oninput="renderHutangMainList()" placeholder="Nama" class="w-full pl-9 pr-3 py-2.5 border border-emerald-600 rounded-lg text-xs font-medium text-gray-900 focus:outline-none">
                </div>

                <!-- Kotak Jatuh Tempo -->
                <div onclick="promptHutangMainDueFilter()" class="w-36 border border-gray-300 rounded-lg px-3 py-2.5 flex items-center space-x-2 cursor-pointer hover:border-emerald-600 transition bg-white">
                    <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                    <span id="label-hutang-main-due-filter" class="text-xs text-gray-500 truncate">Jatuh tempo</span>
                </div>
            </div>

            <!-- Konten Daftar Hutang -->
            <div class="flex-1 overflow-y-auto px-4 pb-24 space-y-4" onclick="hideHutangMainSortMenu()">
                <!-- Kartu Abu-abu Ringkasan Sisa Hutang & Total Pembelian (SS 1000922682) -->
                <div class="bg-slate-100/90 rounded-2xl p-4 flex items-center justify-between shadow-2xs border border-slate-200/60">
                    <div class="flex items-center space-x-3.5">
                        <div class="w-10 h-8 bg-amber-400 rounded-md flex flex-col justify-start pt-1.5 shadow-xs overflow-hidden">
                            <span class="w-full h-1.5 bg-white/80 block"></span>
                        </div>
                        <div>
                            <span class="text-xs text-gray-600 block">Sisa Hutang</span>
                            <span class="text-lg font-extrabold text-gray-900 block mt-0.5" id="hutang-main-total-sisa">Rp 23.864.890,66</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-xs text-gray-600 block">Total Pembelian</span>
                        <span class="text-lg font-extrabold text-gray-900 block mt-0.5" id="hutang-main-total-trx">9</span>
                    </div>
                </div>

                <!-- Checkbox Filter Belum Lunas / Lunas -->
                <div class="flex items-center space-x-8 pt-1 text-xs font-bold text-gray-900">
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" id="chk-hutang-belum-lunas" checked onchange="renderHutangMainList()" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span>Belum Lunas</span>
                    </label>
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" id="chk-hutang-lunas" onchange="renderHutangMainList()" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span>Lunas</span>
                    </label>
                </div>

                <!-- Daftar Baris Supplier yang Memiliki Hutang -->
                <div id="container-hutang-main-rows" class="divide-y divide-gray-100"></div>
            </div>

            <!-- Tombol Sticky Bawah: Tambah Hutang -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openTambahHutangManualView()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs tracking-wide">
                    Tambah Hutang
                </button>
            </div>
        </div>

        <!-- === 2. HALAMAN TAMBAH HUTANG MANUAL (SS 1000922683) === -->
        <div id="view-tambah-hutang-manual" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeTambahHutangManualView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Tambah Hutang</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28">
                <div class="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 space-y-4">
                    <!-- Nominal -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nominal</label>
                        <div class="bg-white border border-gray-300 rounded-xl p-4 flex items-center justify-center">
                            <span class="text-2xl font-bold text-gray-900 mr-1">Rp</span>
                            <input type="number" id="input-manual-hutang-nominal" value="0" class="w-40 text-2xl font-bold text-gray-900 text-center focus:outline-none bg-transparent" pattern="[0-9]*" inputmode="numeric">
                        </div>
                    </div>

                    <!-- Supplier* -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Supplier<span class="text-red-500">*</span></label>
                        <!-- State Belum Pilih -->
                        <div id="box-hutang-pick-sup-btn" onclick="openPilihSupplierHutangView()" class="bg-white border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3 cursor-pointer hover:border-emerald-600 transition">
                            <i class="fa-solid fa-user text-emerald-600 text-base"></i>
                            <span class="text-xs font-bold text-gray-900">Pilih Supplier</span>
                        </div>
                        <!-- State Sudah Pilih -->
                        <div id="box-hutang-selected-sup" class="hidden items-center justify-between py-2 px-1">
                            <span id="label-hutang-selected-sup-name" class="text-sm font-bold text-emerald-600">-</span>
                            <button onclick="clearSelectedSupplierForHutang()" type="button" class="text-emerald-700 hover:text-red-600 text-xl px-1">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Jatuh Tempo -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Jatuh Tempo</label>
                        <div class="bg-white border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3">
                            <i class="fa-regular fa-calendar text-gray-700 text-base"></i>
                            <input type="text" id="input-manual-hutang-due" value="19/10/2026" class="flex-1 text-xs font-bold text-gray-900 bg-transparent focus:outline-none">
                        </div>
                    </div>

                    <!-- Keterangan -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan</label>
                        <textarea id="input-manual-hutang-notes" rows="3" placeholder="Tulis keterangan" class="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"></textarea>
                    </div>

                    <!-- Masukkan ke Cashdrawer -->
                    <div class="pt-1 pb-2 pl-2">
                        <label class="flex items-center space-x-3.5 cursor-pointer">
                            <input type="checkbox" id="chk-manual-hutang-cashdrawer" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Masukkan ke Cashdrawer</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveManualHutangBaru()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === 3. HALAMAN PILIH SUPPLIER (SS 1000922684) === -->
        <div id="view-pilih-supplier-hutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closePilihSupplierHutangView()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Supplier</h2>
                </div>
                <button onclick="renderPilihSupplierHutangList('')" class="text-emerald-600 hover:text-emerald-800 text-lg p-1" title="Muat Ulang">
                    <i class="fa-solid fa-arrows-rotate"></i>
                </button>
            </div>

            <div class="p-3 bg-white border-b flex items-center space-x-2">
                <button onclick="togglePickSupplierSortOrder()" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-700"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="search-pick-sup-hutang" oninput="renderPilihSupplierHutangList(this.value)" placeholder="Nama, email atau no telp" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pb-28" id="container-pick-sup-hutang-rows"></div>

            <!-- Footer Tambah Supplier: Dari Kontak & Manual -->
            <div class="p-3 bg-white border-t absolute bottom-0 left-0 right-0 z-10 text-center space-y-2 shadow-lg">
                <span class="text-[11px] font-bold text-gray-800 block">Tambah Supplier</span>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="addSupplierFromContactPrompt()" type="button" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-full text-xs shadow-sm transition">
                        Dari Kontak
                    </button>
                    <button onclick="addSupplierManualPrompt()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full text-xs shadow-sm transition">
                        Manual
                    </button>
                </div>
            </div>
        </div>

        <!-- === 4. HALAMAN HUTANG PER SUPPLIER (SS 1000922685 & 1000922686) === -->
        <div id="view-supplier-hutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="closeSupplierHutangView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Hutang</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-24 space-y-4" onclick="hideSupHutangSortDropdown()">
                <!-- Kartu Gradasi Ringkasan Hutang Supplier -->
                <div class="bg-gradient-to-r from-amber-50/90 via-rose-50/80 to-pink-50/80 rounded-2xl p-4 space-y-3 shadow-2xs border border-rose-100/60">
                    <div class="flex items-center space-x-2.5">
                        <i class="fa-solid fa-user text-emerald-600 text-base"></i>
                        <span class="font-bold text-xs text-gray-900" id="sup-hutang-title-name">PT sumberintramakmur (beken,tobys)</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <div>
                            <span class="text-gray-600 block">Total Sisa Hutang</span>
                            <span class="font-extrabold text-red-600 text-base mt-0.5 block" id="sup-hutang-amount-disp">Rp 5.745.890</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-600 block">Total Transaksi</span>
                            <span class="font-extrabold text-gray-900 text-base mt-0.5 block" id="sup-hutang-count-disp">3</span>
                        </div>
                    </div>
                    <div class="flex justify-center pt-1">
                        <button onclick="openLunasiSekaligusHutangView('all')" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-12 rounded-full text-xs shadow-sm transition">
                            Lunasi Sekaligus
                        </button>
                    </div>
                </div>

                <!-- Baris Filter Urutan & Semua Transaksi -->
                <div class="flex items-center space-x-2 relative z-20">
                    <div class="relative">
                        <button onclick="event.stopPropagation(); toggleSupHutangSortDropdown()" type="button" class="text-emerald-700 text-lg px-2 py-1 focus:outline-none">
                            <i class="fa-solid fa-arrow-up-wide-short"></i>
                        </button>
                        <div id="dropdown-sup-hutang-sort" class="absolute left-0 top-9 w-52 bg-white rounded-md shadow-2xl border border-gray-200 py-1 hidden z-50 text-xs font-medium text-gray-900">
                            <button onclick="applySupHutangTransactionSort('latest')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Transaksi Terbaru</button>
                            <button onclick="applySupHutangTransactionSort('due')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Jatuh Tempo Terdekat</button>
                        </div>
                    </div>

                    <div onclick="alert('Filter rentang tanggal transaksi hutang supplier')" class="flex-1 border border-gray-300 rounded-xl p-3 flex justify-between items-center text-xs font-bold text-gray-900 cursor-pointer hover:border-emerald-600 transition bg-white">
                        <div class="flex items-center space-x-2.5">
                            <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                            <span>Semua Transaksi</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-gray-700"></i>
                    </div>
                </div>

                <!-- Tombol Merah Buat Hutang -->
                <button onclick="openPopupBuatHutangSupplier()" type="button" class="w-full border border-red-700 bg-rose-50/50 hover:bg-rose-50 text-red-700 font-semibold py-3 rounded-full text-xs transition">
                    Buat Hutang
                </button>

                <!-- Header Daftar Transaksi & Dropdown Belum Lunas -->
                <div class="flex justify-between items-center pt-2">
                    <label class="flex items-center space-x-3 text-xs font-bold text-gray-900 cursor-pointer">
                        <input type="checkbox" id="chk-sup-hutang-select-all" onchange="toggleSelectAllSupHutangTransactions(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span>Daftar Transaksi</span>
                    </label>
                    <select id="select-sup-hutang-status-filter" onchange="renderSupplierHutangTransactions()" class="border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 bg-white focus:outline-none">
                        <option value="unpaid">Belum Lunas</option>
                        <option value="paid">Lunas</option>
                    </select>
                </div>

                <!-- Daftar Item Transaksi Hutang Supplier -->
                <div id="container-sup-debt-rows" class="divide-y divide-gray-100 pt-1"></div>
            </div>

            <!-- Bar Hijau Bawah Saat Ada Transaksi Hutang yang Dicentang (SS 1000922686) -->
            <div id="bar-sup-hutang-checked-lunasi" class="p-3 bg-white border-t absolute bottom-0 left-0 right-0 z-30 hidden">
                <button onclick="openLunasiSekaligusHutangView('checked')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-md shadow-lg flex justify-between items-center text-xs transition active:scale-95">
                    <span>Lunasi Sekaligus</span>
                    <span id="label-sup-hutang-checked-total" class="font-extrabold">Rp 4.408.730</span>
                </button>
            </div>
        </div>

        <!-- === 5. HALAMAN LUNASI SEKALIGUS HUTANG SUPPLIER (SS 1000922687) === -->
        <div id="view-lunasi-sekaligus-hutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeLunasiSekaligusHutangView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700" id="header-pay-hutang-title">Lunasi Sekaligus</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-4">
                <div class="space-y-2 text-xs px-1">
                    <div class="flex items-center space-x-2.5">
                        <i class="fa-solid fa-user text-emerald-600 text-base"></i>
                        <span class="font-bold text-gray-900" id="pay-hutang-sup-name">PT sumberintramakmur (beken,tobys)</span>
                    </div>
                    <div class="flex justify-between items-center pt-1">
                        <div>
                            <span class="text-gray-600 font-semibold block" id="label-pay-hutang-sub">Lunasi sejumlah</span>
                            <span class="text-sm font-extrabold text-red-700 block mt-0.5" id="pay-hutang-unpaid-disp">Rp 4.408.730</span>
                        </div>
                        <div id="box-pay-hutang-trx-count" class="text-right">
                            <span class="text-gray-600 font-semibold block">Total Transaksi</span>
                            <div class="flex items-center justify-end space-x-1.5 mt-0.5">
                                <span class="text-sm font-extrabold text-gray-900" id="pay-hutang-trx-count-val">2</span>
                                <span onclick="alert('Jumlah nota transaksi hutang yang akan dilunasi sekaligus.')" class="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-xs font-bold cursor-pointer">!</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-slate-50/90 border border-slate-100 rounded-2xl p-4 space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nominal</label>
                        <div class="bg-white border border-emerald-600 rounded-xl p-4 flex items-center justify-center">
                            <span class="text-2xl font-extrabold text-gray-900 mr-1">Rp</span>
                            <input type="text" id="input-pay-hutang-nominal" value="4.408.730" class="w-44 text-2xl font-extrabold text-gray-900 text-center focus:outline-none bg-transparent">
                        </div>
                    </div>

                    <!-- Checkbox Lunasi (Muncul saat pembayaran satuan) -->
                    <div id="wrapper-chk-pay-hutang-lunasi" class="hidden">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-pay-hutang-lunasi" onchange="toggleLunasiFullSingleHutang(this.checked)" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Lunasi</span>
                        </label>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Pembayaran</label>
                        <div class="bg-white border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3">
                            <i class="fa-regular fa-calendar text-gray-700 text-base"></i>
                            <input type="text" id="input-pay-hutang-date" class="flex-1 text-xs font-bold text-gray-900 bg-transparent focus:outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Metode Pembayaran</label>
                        <div class="relative">
                            <select id="select-pay-hutang-method" class="w-full bg-white border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 appearance-none focus:outline-none focus:border-emerald-600">
                                <option value="Cash">Cash</option>
                                <option value="Transfer Bank">Transfer Bank</option>
                                <option value="QRIS">QRIS</option>
                            </select>
                            <i class="fa-solid fa-chevron-down text-gray-700 text-xs absolute right-4 top-3.5 pointer-events-none"></i>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan</label>
                        <textarea id="input-pay-hutang-notes" rows="3" placeholder="Tulis keterangan" class="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"></textarea>
                    </div>

                    <div class="pt-1 pb-1 pl-1">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-pay-hutang-cashdrawer" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Ambil dari Cashdrawer</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="submitPembayaranHutangSupplier()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === 6. HALAMAN DETAIL ITEM HUTANG SUPPLIER (SS 1000922688) === -->
        <div id="view-detail-hutang-item" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeDetailHutangItemView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Hutang</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-4 text-xs">
                <div class="flex items-center space-x-2.5">
                    <i class="fa-solid fa-user text-emerald-600 text-base"></i>
                    <span class="font-bold text-gray-900" id="det-hutang-sup-name">PT sumberintramakmur (beken,tobys)</span>
                </div>

                <div class="flex items-center space-x-2 pt-1">
                    <span id="det-hutang-status-dot" class="w-2.5 h-2.5 rounded-full bg-red-700"></span>
                    <span id="det-hutang-status-text" class="font-bold text-gray-900">Belum lunas</span>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-1">
                    <div>
                        <span class="text-gray-500 block">Tanggal Transaksi</span>
                        <span class="font-bold text-gray-900 block mt-0.5" id="det-hutang-trx-date">2026-09-30 16:02:02</span>
                    </div>
                    <div class="text-right">
                        <span class="text-gray-500 block">Jatuh Tempo</span>
                        <span class="font-bold text-gray-900 block mt-0.5" id="det-hutang-due-date">2026/10/30</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-1">
                    <div>
                        <span class="text-gray-500 block">Total Hutang</span>
                        <span class="font-bold text-gray-900 block mt-0.5" id="det-hutang-total">Rp 2.608.730</span>
                    </div>
                    <div class="text-right">
                        <span class="text-gray-500 block">Belum dibayar</span>
                        <span class="font-bold text-red-500 block mt-0.5" id="det-hutang-unpaid">Rp 2.608.730</span>
                    </div>
                </div>

                <!-- Tombol Lihat Detail Struk -> Buka Struk Pembelian Stok -->
                <div onclick="openStrukFromDetailHutang()" class="bg-slate-100/90 hover:bg-slate-200/80 p-3.5 px-4 rounded-xl flex justify-between items-center cursor-pointer transition mt-2">
                    <span class="font-bold text-gray-900">Lihat detail struk</span>
                    <i class="fa-solid fa-chevron-right text-gray-800 text-sm"></i>
                </div>

                <div class="text-center font-bold text-gray-900 pt-2">
                    History pembayaran
                </div>

                <!-- Daftar Kartu History Pembayaran Hutang (Jika sudah ada cicilan) -->
                <div id="container-det-hutang-history" class="space-y-3"></div>
            </div>

            <!-- Tombol Sticky Bawah: PEMBAYARAN -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openLunasiSekaligusHutangView('single')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    PEMBAYARAN
                </button>
            </div>
        </div>
    `;

    // 3. SUNTIKKAN HTML MODAL TAMBAH HUTANG CEPAT KE DALAM #modals-container
    const modalsHTML = `
        <div id="modal-sup-tambah-hutang" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-3.5 text-xs">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 text-center pb-3 border-b">TAMBAH HUTANG</h3>
                <div>
                    <label class="block font-semibold text-gray-600 mb-1">Besar Hutang<span class="text-red-500">*</span></label>
                    <input type="number" id="input-popup-sup-hutang-amount" class="w-full border border-gray-300 rounded-full p-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                </div>
                <div>
                    <label class="block font-semibold text-gray-600 mb-1">Tanggal Jatuh Tempo</label>
                    <div class="border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3">
                        <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                        <input type="text" id="input-popup-sup-hutang-due" value="19/10/2026" class="flex-1 font-semibold text-gray-800 bg-transparent focus:outline-none">
                    </div>
                </div>
                <div>
                    <label class="block font-semibold text-gray-600 mb-1">Keterangan</label>
                    <input type="text" id="input-popup-sup-hutang-notes" class="w-full border border-gray-300 rounded-full p-3 px-4 text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div class="pt-1 pl-2">
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="chk-popup-sup-hutang-cashdrawer" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300">
                        <span class="font-bold text-gray-900">Masukkan ke Cashdrawer</span>
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <button onclick="closePopupBuatHutangSupplier()" type="button" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase">BATAL</button>
                    <button onclick="savePopupBuatHutangSupplier()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md">SIMPAN</button>
                </div>
            </div>
        </div>
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    const mdContainer = document.getElementById('modals-container');
    if (mdContainer) mdContainer.insertAdjacentHTML('beforeend', modalsHTML);

    // ========================================================================
    // 4. DATA AWAL SUPPLIER & HUTANG SESUAI SCREENSHOT (SS 1000922682 - 1000922688)
    // ========================================================================
    const defaultHutangSuppliers = [
        {
            id: "sup_ppm",
            avatarCode: "PP",
            name: "PPM PancaPackindoMakmur",
            email: "pancapackindo@gmail.com",
            phone: "8123000111",
            address: "Malang",
            debtCount: 1,
            debtAmount: 1320000,
            trxCount: 8,
            debts: [
                { id: "hut_ppm_1", trxDate: "2026-09-25 10:15:00", date: "25/09/2026", dueDate: "2026/10/09", status: "Belum lunas", totalAmount: 1320000, amount: 1320000, isOverdue: true, history: [] }
            ]
        },
        {
            id: "sup_mg",
            avatarCode: "PT",
            name: "PT MITRA GRESIK",
            email: "mitragresik@gmail.com",
            phone: "8123000222",
            address: "Gresik",
            debtCount: 1,
            debtAmount: 1638000,
            trxCount: 5,
            debts: [
                { id: "hut_mg_1", trxDate: "2026-09-30 11:00:00", date: "30/09/2026", dueDate: "2026/10/14", status: "Belum lunas", totalAmount: 1638000, amount: 1638000, isOverdue: false, history: [] }
            ]
        },
        {
            id: "sup_fw",
            avatarCode: "FE",
            name: "Felix Wijaya (TW)",
            email: "felixwijaya@gmail.com",
            phone: "8123000333",
            address: "Surabaya",
            debtCount: 1,
            debtAmount: 7962000.9,
            trxCount: 14,
            debts: [
                { id: "hut_fw_1", trxDate: "2026-10-02 13:20:00", date: "02/10/2026", dueDate: "2026/10/16", status: "Belum lunas", totalAmount: 7962000.9, amount: 7962000.9, isOverdue: false, history: [] }
            ]
        },
        {
            id: "sup_fn",
            avatarCode: "PT",
            name: "PT. FarmaNiagaD(mitu, klinpak)",
            email: "farmaniaga@gmail.com",
            phone: "8123000444",
            address: "Malang",
            debtCount: 1,
            debtAmount: 171901.44,
            trxCount: 6,
            debts: [
                { id: "hut_fn_1", trxDate: "2026-10-03 09:40:00", date: "03/10/2026", dueDate: "2026/10/17", status: "Belum lunas", totalAmount: 171901.44, amount: 171901.44, isOverdue: false, history: [] }
            ]
        },
        {
            id: "sup_ud",
            avatarCode: "PT",
            name: "PT.UniramaDuta (Paseo)",
            email: "uniramaduta@gmail.com",
            phone: "8123000555",
            address: "Malang",
            debtCount: 1,
            debtAmount: 3475097.12,
            trxCount: 9,
            debts: [
                { id: "hut_ud_1", trxDate: "2026-10-04 14:10:00", date: "04/10/2026", dueDate: "2026/10/18", status: "Belum lunas", totalAmount: 3475097.12, amount: 3475097.12, isOverdue: false, history: [] }
            ]
        },
        {
            id: "sup_sim",
            avatarCode: "PT",
            name: "PT sumberintramakmur (beken,tobys)",
            email: "sumberintramakmur@gmail.com",
            phone: "8123000666",
            address: "Malang",
            debtCount: 3,
            debtAmount: 5745890,
            trxCount: 11,
            debts: [
                { id: "hut_sim_1", trxDate: "2026-09-19 10:12:00", date: "19/09/2026", dueDate: "2026/10/18", status: "Belum lunas", totalAmount: 1337160, amount: 1337160, isOverdue: false, history: [] },
                { id: "hut_sim_2", trxDate: "2026-09-30 16:02:02", date: "30/09/2026", dueDate: "2026/10/30", status: "Belum lunas", totalAmount: 2608730, amount: 2608730, isOverdue: false, history: [] },
                { id: "hut_sim_3", trxDate: "2026-10-09 11:30:00", date: "09/10/2026", dueDate: "2026/11/08", status: "Belum lunas", totalAmount: 1800000, amount: 1800000, isOverdue: false, history: [] }
            ]
        },
        {
            id: "sup_ph",
            avatarCode: "PL",
            name: "Plastik Hakim (Caruban-Madiun)",
            email: "plastikhakim@gmail.com",
            phone: "8123000777",
            address: "Caruban, Madiun",
            debtCount: 1,
            debtAmount: 3552001.2,
            trxCount: 7,
            debts: [
                { id: "hut_ph_1", trxDate: "2026-10-04 15:45:00", date: "04/10/2026", dueDate: "2026/10/18", status: "Belum lunas", totalAmount: 3552001.2, amount: 3552001.2, isOverdue: false, history: [] }
            ]
        },
        // Daftar Supplier dari SS 1000922684 (Pilih Supplier)
        { id: "sup_bu", avatarCode: "BU", name: "Bu (amplop,valentine)", email: "amplopvalentine@gmail.com", phone: "8123101", address: "Malang", debtCount: 0, debtAmount: 0, trxCount: 3, debts: [] },
        { id: "sup_ca", avatarCode: "CA", name: "Camel (dus)", email: "cameldus@gmail.com", phone: "8123102", address: "Malang", debtCount: 0, debtAmount: 0, trxCount: 4, debts: [] },
        { id: "sup_mas", avatarCode: "CV", name: "CV. MitraArtaSukses(SeeU)", email: "seeu@gmail.com", phone: "8123103", address: "Surabaya", debtCount: 0, debtAmount: 0, trxCount: 6, debts: [] },
        { id: "sup_mk", avatarCode: "CV", name: "CV.Mekar (Huda HOK)", email: "hudahok@gmail.com", phone: "8123104", address: "Malang", debtCount: 0, debtAmount: 0, trxCount: 5, debts: [] },
        { id: "sup_dl", avatarCode: "DU", name: "Dus Lamaran (Batu)", email: "duslamaran@gmail.com", phone: "8123105", address: "Batu", debtCount: 0, debtAmount: 0, trxCount: 2, debts: [] },
        { id: "sup_ej", avatarCode: "EK", name: "Eka Jaya (Rajut)", email: "ekajaya@gmail.com", phone: "8123106", address: "Malang", debtCount: 0, debtAmount: 0, trxCount: 4, debts: [] },
        { id: "sup_ea", avatarCode: "EL", name: "Elok Abadi Sayur (waring)", email: "elokabadisayur@gmail.com", phone: "8123107", address: "Batu", debtCount: 0, debtAmount: 0, trxCount: 3, debts: [] },
        { id: "sup_en", avatarCode: "EN", name: "Energy (Rege)", email: "energy@gmail.com", phone: "8123108", address: "Malang", debtCount: 0, debtAmount: 0, trxCount: 5, debts: [] },
        { id: "sup_hp", avatarCode: "HE", name: "HendryPasman (TrashBag)", email: "hendrypasman@gmail.com", phone: "8123109", address: "Surabaya", debtCount: 0, debtAmount: 0, trxCount: 6, debts: [] }
    ];

    if (!window.suppliersList) window.suppliersList = [];
    defaultHutangSuppliers.forEach(ds => {
        const ex = window.suppliersList.find(s => s.name === ds.name);
        if (!ex) {
            window.suppliersList.push(ds);
        } else if (!ex.debts || ex.debts.length === 0) {
            ex.debts = ds.debts;
            ex.debtAmount = ds.debtAmount;
            ex.debtCount = ds.debtCount;
        }
    });

    // State Navigasi & Seleksi Hutang
    let hutangMainSortBy = 'due';
    let hutangMainDueFilter = '';
    let selectedSupForManualHutang = null;
    let pickSupSortAsc = true;

    let activeHutangSupplier = window.suppliersList.find(s => s.id === 'sup_sim') || window.suppliersList[0];
    let supHutangReturnView = 'view-hutang-main';
    let supHutangSortBy = 'latest';
    let activeHutangItem = null;
    let hutangPayMode = 'checked'; // 'single', 'checked', 'all'
    let currentHutangPayTargetAmount = 0;

    function formatRupiahDec(val) {
        const num = Number(val) || 0;
        return num.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
    }

    // ========================================================================
    // 5. LOGIKA HALAMAN UTAMA HUTANG (SS 1000922682)
    // ========================================================================
    window.openHutangMainView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-hutang-main').classList.remove('hidden');
        window.renderHutangMainList();
    };

    window.toggleHutangMainSortMenu = () => {
        document.getElementById('dropdown-hutang-main-sort').classList.toggle('hidden');
    };
    window.hideHutangMainSortMenu = () => {
        const el = document.getElementById('dropdown-hutang-main-sort');
        if (el) el.classList.add('hidden');
    };
    window.applyHutangMainSort = (mode) => {
        hutangMainSortBy = mode;
        window.hideHutangMainSortMenu();
        window.renderHutangMainList();
    };

    window.promptHutangMainDueFilter = () => {
        const input = prompt("Filter Tanggal Jatuh Tempo (Format YYYY/MM/DD, kosongkan untuk tampilkan semua):", hutangMainDueFilter);
        if (input === null) return;
        hutangMainDueFilter = input.trim();
        document.getElementById('label-hutang-main-due-filter').innerText = hutangMainDueFilter || 'Jatuh tempo';
        window.renderHutangMainList();
    };

    window.renderHutangMainList = function() {
        const container = document.getElementById('container-hutang-main-rows');
        if (!container) return;
        container.innerHTML = '';

        const keyword = (document.getElementById('hutang-main-search')?.value || '').toLowerCase();
        const showUnpaid = document.getElementById('chk-hutang-belum-lunas')?.checked !== false;
        const showPaid = document.getElementById('chk-hutang-lunas')?.checked === true;

        let supSummaries = [];
        let grandTotalSisa = 0;
        let grandTotalPembelian = 0;

        // Tampilkan 7 supplier utama seperti di SS 1000922682
        (window.suppliersList || []).forEach(s => {
            if (s.id === 'sup_alta') return; // Disimpan untuk menu Supplier Terkait Barang
            const list = s.debts || [];
            if (list.length === 0) return;

            const matchingItems = list.filter(d => {
                const isUnpaid = (Number(d.amount) || 0) > 0;
                if (isUnpaid && !showUnpaid) return false;
                if (!isUnpaid && !showPaid) return false;
                if (hutangMainDueFilter && d.dueDate !== hutangMainDueFilter) return false;
                return true;
            });

            if (matchingItems.length === 0) return;
            if (keyword && !s.name.toLowerCase().includes(keyword)) return;

            const firstItemAmount = Number(matchingItems[0].amount) || 0;
            const totalSisaSup = matchingItems.reduce((acc, x) => acc + (Number(x.amount) || 0), 0);
            const nearestDue = matchingItems[0].dueDate || '2026/10/18';
            const isOverdue = matchingItems[0].isOverdue === true;

            grandTotalSisa += totalSisaSup;
            grandTotalPembelian += matchingItems.length;

            supSummaries.push({
                sup: s,
                nearestDue,
                firstItemAmount,
                totalSisaSup,
                isOverdue,
                isUnpaid: totalSisaSup > 0
            });
        });

        supSummaries.sort((a, b) => {
            if (hutangMainSortBy === 'name') return a.sup.name.localeCompare(b.sup.name);
            return a.nearestDue.localeCompare(b.nearestDue);
        });

        document.getElementById('hutang-main-total-sisa').innerText = `Rp ${formatRupiahDec(grandTotalSisa)}`;
        document.getElementById('hutang-main-total-trx').innerText = grandTotalPembelian;

        if (supSummaries.length === 0) {
            container.innerHTML = `<div class="py-12 text-center text-xs text-gray-400 font-semibold">Tidak ada data hutang yang sesuai filter.</div>`;
            return;
        }

        supSummaries.forEach((row, idx) => {
            const leftPriceColor = row.isOverdue ? 'text-red-600 font-bold' : 'text-gray-700 font-medium';
            const statusDot = row.isUnpaid ? 'bg-red-700' : 'bg-emerald-600';
            const statusLabel = row.isUnpaid ? 'Belum Lunas' : 'Lunas';

            container.innerHTML += `
                <div onclick="openSupplierHutangFromMain('${row.sup.id}')" class="py-3.5 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition text-xs">
                    <div class="flex items-start space-x-3.5 pr-2">
                        <span class="text-gray-600 font-semibold pt-0.5">${idx + 1}</span>
                        <div class="space-y-0.5">
                            <h4 class="font-extrabold text-gray-900 text-xs leading-snug">${row.sup.name}</h4>
                            <p class="text-[11px] text-gray-600 font-medium">JT: ${row.nearestDue}</p>
                            <p class="text-[11px] ${leftPriceColor}">Rp ${formatRupiahDec(row.firstItemAmount)}</p>
                        </div>
                    </div>
                    <div class="text-right space-y-1 flex-shrink-0">
                        <span class="inline-flex items-center font-semibold text-gray-900 text-[11px]">
                            <span class="w-2.5 h-2.5 rounded-full ${statusDot} mr-1.5"></span>${statusLabel}
                        </span>
                        <p class="font-bold text-red-700 text-xs">Rp ${formatRupiahDec(row.totalSisaSup)}</p>
                    </div>
                </div>
            `;
        });
    };

    // ========================================================================
    // 6. TAMBAH HUTANG MANUAL & PILIH SUPPLIER (SS 1000922683 & 1000922684)
    // ========================================================================
    window.openTambahHutangManualView = () => {
        selectedSupForManualHutang = null;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-tambah-hutang-manual').classList.remove('hidden');

        document.getElementById('input-manual-hutang-nominal').value = '0';
        document.getElementById('input-manual-hutang-due').value = '19/10/2026';
        document.getElementById('input-manual-hutang-notes').value = '';
        document.getElementById('chk-manual-hutang-cashdrawer').checked = true;
        updateSelectedSupplierForHutangUI();
    };

    window.closeTambahHutangManualView = () => {
        document.getElementById('view-tambah-hutang-manual').classList.add('hidden');
        document.getElementById('view-hutang-main').classList.remove('hidden');
        window.renderHutangMainList();
    };

    function updateSelectedSupplierForHutangUI() {
        const btnPick = document.getElementById('box-hutang-pick-sup-btn');
        const boxSelected = document.getElementById('box-hutang-selected-sup');
        const lblName = document.getElementById('label-hutang-selected-sup-name');

        if (selectedSupForManualHutang) {
            btnPick.classList.add('hidden');
            boxSelected.classList.remove('hidden');
            boxSelected.classList.add('flex');
            lblName.innerText = selectedSupForManualHutang.name;
        } else {
            btnPick.classList.remove('hidden');
            boxSelected.classList.add('hidden');
            boxSelected.classList.remove('flex');
        }
    }

    window.clearSelectedSupplierForHutang = () => {
        selectedSupForManualHutang = null;
        updateSelectedSupplierForHutangUI();
    };

    window.openPilihSupplierHutangView = () => {
        document.getElementById('view-tambah-hutang-manual').classList.add('hidden');
        document.getElementById('view-pilih-supplier-hutang').classList.remove('hidden');
        document.getElementById('search-pick-sup-hutang').value = '';
        window.renderPilihSupplierHutangList('');
    };

    window.closePilihSupplierHutangView = () => {
        document.getElementById('view-pilih-supplier-hutang').classList.add('hidden');
        document.getElementById('view-tambah-hutang-manual').classList.remove('hidden');
    };

    window.togglePickSupplierSortOrder = () => {
        pickSupSortAsc = !pickSupSortAsc;
        window.renderPilihSupplierHutangList(document.getElementById('search-pick-sup-hutang').value);
    };

    window.renderPilihSupplierHutangList = function(keyword = '') {
        const container = document.getElementById('container-pick-sup-hutang-rows');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        let list = (window.suppliersList || []).filter(s =>
            (s.name || '').toLowerCase().includes(k) ||
            (s.email || '').toLowerCase().includes(k) ||
            (s.phone || '').toLowerCase().includes(k)
        );

        list.sort((a, b) => pickSupSortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

        list.forEach(s => {
            const initials = (s.avatarCode || s.name.substring(0, 2)).toUpperCase();
            container.innerHTML += `
                <div onclick="chooseSupplierForManualHutang('${s.id}')" class="p-4 bg-white flex items-center space-x-3.5 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
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

    window.chooseSupplierForManualHutang = (supId) => {
        selectedSupForManualHutang = (window.suppliersList || []).find(s => s.id === supId);
        window.closePilihSupplierHutangView();
        updateSelectedSupplierForHutangUI();
    };

    window.addSupplierFromContactPrompt = () => {
        const name = prompt("Masukkan nama supplier dari kontak:");
        if (!name || !name.trim()) return;
        const newSup = {
            id: 'sup_' + Date.now(),
            avatarCode: name.trim().substring(0, 2).toUpperCase(),
            name: name.trim(),
            email: name.trim().toLowerCase().replace(/[^a-z0-9]/g, '') + '@gmail.com',
            phone: '812345678',
            address: 'Malang',
            debtCount: 0,
            debtAmount: 0,
            trxCount: 0,
            debts: []
        };
        window.suppliersList.push(newSup);
        window.chooseSupplierForManualHutang(newSup.id);
    };

    window.addSupplierManualPrompt = () => {
        const name = prompt("Masukkan nama supplier baru:");
        if (!name || !name.trim()) return;
        const email = prompt("Masukkan email supplier (opsional):", "") || "-";
        const newSup = {
            id: 'sup_' + Date.now(),
            avatarCode: name.trim().substring(0, 2).toUpperCase(),
            name: name.trim(),
            email: email.trim(),
            phone: '812345678',
            address: 'Malang',
            debtCount: 0,
            debtAmount: 0,
            trxCount: 0,
            debts: []
        };
        window.suppliersList.push(newSup);
        window.chooseSupplierForManualHutang(newSup.id);
    };

    window.saveManualHutangBaru = () => {
        const nominal = Number(document.getElementById('input-manual-hutang-nominal').value) || 0;
        const dueRaw = document.getElementById('input-manual-hutang-due').value.trim();
        const notes = document.getElementById('input-manual-hutang-notes').value.trim();

        if (!selectedSupForManualHutang) return alert("Pilih Supplier terlebih dahulu!");
        if (nominal <= 0) return alert("Masukkan nominal hutang lebih dari Rp 0!");

        const parts = dueRaw.split('/');
        const formattedDue = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : '2026/10/19';
        const nowStr = window.getFormattedCurrentDateTime().replace(/\//g, '-');

        if (!Array.isArray(selectedSupForManualHutang.debts)) selectedSupForManualHutang.debts = [];
        selectedSupForManualHutang.debts.push({
            id: 'hut_' + Date.now(),
            trxDate: nowStr,
            date: "12/10/2026",
            dueDate: formattedDue,
            status: "Belum lunas",
            totalAmount: nominal,
            amount: nominal,
            notes: notes,
            history: []
        });

        selectedSupForManualHutang.debtCount = selectedSupForManualHutang.debts.length;
        selectedSupForManualHutang.debtAmount = selectedSupForManualHutang.debts.reduce((s, x) => s + (Number(x.amount) || 0), 0);

        alert("Data hutang baru berhasil disimpan!");
        window.closeTambahHutangManualView();
    };

    // ========================================================================
    // 7. HALAMAN HUTANG PER SUPPLIER (SS 1000922685 & 1000922686)
    // ========================================================================
    window.openSupplierHutangFromMain = (supId) => {
        const s = (window.suppliersList || []).find(x => x.id === supId);
        if (!s) return;
        activeHutangSupplier = s;
        supHutangReturnView = 'view-hutang-main';
        openSupplierHutangScreen();
    };

    // Override fungsi openSupplierHutangView agar dari Detail Supplier juga membuka layar lengkap ini
    window.openSupplierHutangView = () => {
        const profName = document.getElementById('prof-sup-name')?.innerText;
        const found = (window.suppliersList || []).find(s => s.name === profName) || activeHutangSupplier;
        activeHutangSupplier = found;
        supHutangReturnView = 'view-supplier-detail';
        openSupplierHutangScreen();
    };

    function openSupplierHutangScreen() {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-supplier-hutang').classList.remove('hidden');
        document.getElementById('chk-sup-hutang-select-all').checked = false;
        window.renderSupplierHutangTransactions();
    }

    window.closeSupplierHutangView = () => {
        document.getElementById('view-supplier-hutang').classList.add('hidden');
        document.getElementById(supHutangReturnView).classList.remove('hidden');
        if (supHutangReturnView === 'view-hutang-main') {
            window.renderHutangMainList();
        }
    };

    window.toggleSupHutangSortDropdown = () => {
        document.getElementById('dropdown-sup-hutang-sort').classList.toggle('hidden');
    };
    window.hideSupHutangSortDropdown = () => {
        const el = document.getElementById('dropdown-sup-hutang-sort');
        if (el) el.classList.add('hidden');
    };
    window.applySupHutangTransactionSort = (mode) => {
        supHutangSortBy = mode;
        window.hideSupHutangSortDropdown();
        window.renderSupplierHutangTransactions();
    };

    window.renderSupplierHutangTransactions = function() {
        if (!activeHutangSupplier) return;
        const list = activeHutangSupplier.debts || [];
        const statusFilter = document.getElementById('select-sup-hutang-status-filter')?.value || 'unpaid';

        let totalSisa = 0;
        let unpaidCount = 0;
        list.forEach(d => {
            const rem = Number(d.amount) || 0;
            if (rem > 0) {
                totalSisa += rem;
                unpaidCount++;
            }
        });

        activeHutangSupplier.debtAmount = totalSisa;
        document.getElementById('sup-hutang-title-name').innerText = activeHutangSupplier.name;
        document.getElementById('sup-hutang-amount-disp').innerText = `Rp ${formatRupiahDec(totalSisa)}`;
        document.getElementById('sup-hutang-count-disp').innerText = unpaidCount;

        let filtered = list.filter(d => {
            const isUnpaid = (Number(d.amount) || 0) > 0;
            return statusFilter === 'unpaid' ? isUnpaid : !isUnpaid;
        });

        filtered.sort((a, b) => {
            if (supHutangSortBy === 'due') return (a.dueDate || '').localeCompare(b.dueDate || '');
            return (a.trxDate || '').localeCompare(b.trxDate || '');
        });

        const container = document.getElementById('container-sup-debt-rows');
        container.innerHTML = '';

        filtered.forEach(d => {
            const isUnpaid = (Number(d.amount) || 0) > 0;
            container.innerHTML += `
                <div class="py-3.5 flex items-center justify-between text-xs">
                    <div class="flex items-center space-x-4 flex-1">
                        <input type="checkbox" name="chk_sup_hutang_item" value="${d.id}" data-amount="${d.amount}" onchange="updateSupHutangCheckedBottomBar()" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                        <div onclick="openDetailHutangItemView('${d.id}')" class="space-y-0.5 flex-1 cursor-pointer">
                            <span class="text-emerald-600 font-bold block">${d.date || '30/09/2026'}</span>
                            <span class="text-gray-900 font-semibold block">${isUnpaid ? 'Belum Dibayar' : 'Lunas'}</span>
                            <span class="text-gray-900 font-semibold block">Jatuh Tempo  ${d.dueDate}</span>
                        </div>
                    </div>
                    <div onclick="openDetailHutangItemView('${d.id}')" class="text-right space-y-1 cursor-pointer">
                        <span class="inline-flex items-center text-gray-900 font-semibold">
                            <span class="w-2.5 h-2.5 rounded-full ${isUnpaid ? 'bg-red-700' : 'bg-emerald-600'} mr-1.5"></span>${isUnpaid ? 'Belum lunas' : 'Lunas'}
                        </span>
                        <p class="font-bold text-gray-900">Rp ${formatRupiahDec(d.amount || d.totalAmount)}</p>
                    </div>
                </div>
            `;
        });

        window.updateSupHutangCheckedBottomBar();
    };

    window.toggleSelectAllSupHutangTransactions = (checked) => {
        document.querySelectorAll('input[name="chk_sup_hutang_item"]').forEach(chk => {
            chk.checked = checked;
        });
        window.updateSupHutangCheckedBottomBar();
    };

    window.updateSupHutangCheckedBottomBar = () => {
        const checkedBoxes = document.querySelectorAll('input[name="chk_sup_hutang_item"]:checked');
        const bottomBar = document.getElementById('bar-sup-hutang-checked-lunasi');
        const totalLbl = document.getElementById('label-sup-hutang-checked-total');

        if (checkedBoxes.length > 0) {
            let sum = 0;
            checkedBoxes.forEach(c => sum += Number(c.getAttribute('data-amount')) || 0);
            totalLbl.innerText = `Rp ${formatRupiahDec(sum)}`;
            bottomBar.classList.remove('hidden');
        } else {
            bottomBar.classList.add('hidden');
        }
    };

    // --- POPUP TAMBAH HUTANG DI DALAM SUPPLIER ---
    window.openPopupBuatHutangSupplier = () => {
        document.getElementById('input-popup-sup-hutang-amount').value = '';
        document.getElementById('input-popup-sup-hutang-due').value = '19/10/2026';
        document.getElementById('input-popup-sup-hutang-notes').value = '';
        document.getElementById('chk-popup-sup-hutang-cashdrawer').checked = true;
        document.getElementById('modal-sup-tambah-hutang').classList.remove('hidden');
    };
    window.closePopupBuatHutangSupplier = () => {
        document.getElementById('modal-sup-tambah-hutang').classList.add('hidden');
    };
    window.savePopupBuatHutangSupplier = () => {
        const amount = Number(document.getElementById('input-popup-sup-hutang-amount').value) || 0;
        const dueRaw = document.getElementById('input-popup-sup-hutang-due').value.trim();
        const notes = document.getElementById('input-popup-sup-hutang-notes').value.trim();

        if (amount <= 0) return alert("Besar Hutang* wajib diisi lebih dari 0!");

        const parts = dueRaw.split('/');
        const formattedDue = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : '2026/10/19';
        const nowStr = window.getFormattedCurrentDateTime().replace(/\//g, '-');

        if (!Array.isArray(activeHutangSupplier.debts)) activeHutangSupplier.debts = [];
        activeHutangSupplier.debts.push({
            id: 'hut_' + Date.now(),
            trxDate: nowStr,
            date: "12/10/2026",
            dueDate: formattedDue,
            status: "Belum lunas",
            totalAmount: amount,
            amount: amount,
            notes: notes,
            history: []
        });

        window.closePopupBuatHutangSupplier();
        window.renderSupplierHutangTransactions();
    };

    // ========================================================================
    // 8. HALAMAN DETAIL ITEM HUTANG SUPPLIER (SS 1000922688)
    // ========================================================================
    window.openDetailHutangItemView = (debtId) => {
        const d = (activeHutangSupplier?.debts || []).find(x => x.id === debtId);
        if (!d) return;
        activeHutangItem = d;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-detail-hutang-item').classList.remove('hidden');

        renderDetailHutangItemContent();
    };

    window.closeDetailHutangItemView = () => {
        document.getElementById('view-detail-hutang-item').classList.add('hidden');
        document.getElementById('view-supplier-hutang').classList.remove('hidden');
        window.renderSupplierHutangTransactions();
    };

    function renderDetailHutangItemContent() {
        if (!activeHutangItem) return;
        const isUnpaid = (Number(activeHutangItem.amount) || 0) > 0;
        const total = Number(activeHutangItem.totalAmount || activeHutangItem.amount) || 0;
        const unpaid = Number(activeHutangItem.amount) || 0;

        document.getElementById('det-hutang-sup-name').innerText = activeHutangSupplier ? activeHutangSupplier.name : '-';
        document.getElementById('det-hutang-status-dot').className = `w-2.5 h-2.5 rounded-full ${isUnpaid ? 'bg-red-700' : 'bg-emerald-600'}`;
        document.getElementById('det-hutang-status-text').innerText = isUnpaid ? 'Belum lunas' : 'Lunas';
        document.getElementById('det-hutang-trx-date').innerText = activeHutangItem.trxDate || '2026-09-30 16:02:02';
        document.getElementById('det-hutang-due-date').innerText = activeHutangItem.dueDate || '2026/10/30';
        document.getElementById('det-hutang-total').innerText = `Rp ${formatRupiahDec(total)}`;
        document.getElementById('det-hutang-unpaid').innerText = `Rp ${formatRupiahDec(unpaid)}`;

        const histContainer = document.getElementById('container-det-hutang-history');
        histContainer.innerHTML = '';

        (activeHutangItem.history || []).forEach((h, hIdx) => {
            histContainer.innerHTML += `
                <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <div class="bg-emerald-100/80 text-emerald-800 text-[11px] font-bold px-4 py-2 inline-block rounded-br-xl">
                        Tgl Pembayaran : ${h.date}
                    </div>
                    <div class="p-4 pt-3 space-y-2">
                        <div class="grid grid-cols-3 gap-4">
                            <div><span class="text-gray-500 block">No.</span><span class="font-bold text-gray-900">${hIdx + 1}.</span></div>
                            <div><span class="text-gray-500 block">Cicilan</span><span class="font-bold text-gray-900">Rp ${formatRupiahDec(h.paid)}</span></div>
                            <div><span class="text-gray-500 block">Belum dibayar</span><span class="font-bold text-red-500">Rp ${formatRupiahDec(h.remaining)}</span></div>
                        </div>
                        <p class="text-gray-500 font-semibold pt-1">Oleh : ${h.by || 'Adm'}</p>
                    </div>
                </div>
            `;
        });
    }

    window.openStrukFromDetailHutang = () => {
        if (window.openSupplierReceiptView) {
            window.openSupplierReceiptView(0);
        }
    };

    // ========================================================================
    // 9. HALAMAN LUNASI SEKALIGUS & PEMBAYARAN HUTANG (SS 1000922687)
    // ========================================================================
    window.openLunasiSekaligusHutangView = (mode = 'checked') => {
        hutangPayMode = mode;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-lunasi-sekaligus-hutang').classList.remove('hidden');

        const headerTitle = document.getElementById('header-pay-hutang-title');
        const subLabel = document.getElementById('label-pay-hutang-sub');
        const trxCountBox = document.getElementById('box-pay-hutang-trx-count');
        const trxCountVal = document.getElementById('pay-hutang-trx-count-val');
        const chkLunasiWrap = document.getElementById('wrapper-chk-pay-hutang-lunasi');
        const nominalInput = document.getElementById('input-pay-hutang-nominal');

        document.getElementById('pay-hutang-sup-name').innerText = activeHutangSupplier ? activeHutangSupplier.name : '-';
        document.getElementById('input-pay-hutang-date').value = window.getFormattedCurrentDateTime().replace(/\//g, '-');
        document.getElementById('select-pay-hutang-method').value = 'Cash';
        document.getElementById('input-pay-hutang-notes').value = '';
        document.getElementById('chk-pay-hutang-cashdrawer').checked = true;

        if (mode === 'single' && activeHutangItem) {
            currentHutangPayTargetAmount = Number(activeHutangItem.amount) || 0;
            headerTitle.innerText = 'Pembayaran Hutang';
            subLabel.innerText = 'Belum dibayar';
            trxCountBox.classList.add('hidden');
            chkLunasiWrap.classList.remove('hidden');
            document.getElementById('chk-pay-hutang-lunasi').checked = false;
            nominalInput.value = '0';
            nominalInput.readOnly = false;
        } else if (mode === 'checked') {
            const checkedBoxes = document.querySelectorAll('input[name="chk_sup_hutang_item"]:checked');
            let sum = 0;
            checkedBoxes.forEach(c => sum += Number(c.getAttribute('data-amount')) || 0);
            currentHutangPayTargetAmount = sum;

            headerTitle.innerText = 'Lunasi Sekaligus';
            subLabel.innerText = 'Lunasi sejumlah';
            trxCountBox.classList.remove('hidden');
            trxCountVal.innerText = checkedBoxes.length;
            chkLunasiWrap.classList.add('hidden');
            nominalInput.value = formatRupiahDec(sum);
            nominalInput.readOnly = true;
        } else {
            const unpaidList = (activeHutangSupplier?.debts || []).filter(d => (Number(d.amount) || 0) > 0);
            const sum = unpaidList.reduce((s, x) => s + (Number(x.amount) || 0), 0);
            currentHutangPayTargetAmount = sum;

            headerTitle.innerText = 'Lunasi Sekaligus';
            subLabel.innerText = 'Lunasi sejumlah';
            trxCountBox.classList.remove('hidden');
            trxCountVal.innerText = unpaidList.length;
            chkLunasiWrap.classList.add('hidden');
            nominalInput.value = formatRupiahDec(sum);
            nominalInput.readOnly = true;
        }

        document.getElementById('pay-hutang-unpaid-disp').innerText = `Rp ${formatRupiahDec(currentHutangPayTargetAmount)}`;
    };

    window.closeLunasiSekaligusHutangView = () => {
        document.getElementById('view-lunasi-sekaligus-hutang').classList.add('hidden');
        if (hutangPayMode === 'single') {
            document.getElementById('view-detail-hutang-item').classList.remove('hidden');
        } else {
            document.getElementById('view-supplier-hutang').classList.remove('hidden');
        }
    };

    window.toggleLunasiFullSingleHutang = (checked) => {
        document.getElementById('input-pay-hutang-nominal').value = checked ? currentHutangPayTargetAmount : '0';
    };

    window.submitPembayaranHutangSupplier = () => {
        const rawNominal = document.getElementById('input-pay-hutang-nominal').value.replace(/\./g, '').replace(/,/g, '.');
        const payNominal = parseFloat(rawNominal) || 0;
        const payDate = document.getElementById('input-pay-hutang-date').value.trim();
        const payMethod = document.getElementById('select-pay-hutang-method').value;
        const payNotes = document.getElementById('input-pay-hutang-notes').value.trim();

        if (payNominal <= 0) return alert("Masukkan nominal pembayaran hutang lebih dari Rp 0!");

        if (hutangPayMode === 'single' && activeHutangItem) {
            const newRem = Math.max(0, (Number(activeHutangItem.amount) || 0) - payNominal);
            activeHutangItem.amount = newRem;
            activeHutangItem.status = newRem <= 0 ? 'Lunas' : 'Belum lunas';
            if (!Array.isArray(activeHutangItem.history)) activeHutangItem.history = [];
            activeHutangItem.history.push({
                date: payDate,
                paid: payNominal,
                remaining: newRem,
                by: 'Adm',
                method: payMethod,
                notes: payNotes
            });
            alert("Pembayaran hutang berhasil disimpan!");
            document.getElementById('view-lunasi-sekaligus-hutang').classList.add('hidden');
            document.getElementById('view-detail-hutang-item').classList.remove('hidden');
            renderDetailHutangItemContent();
        } else {
            const checkedIds = Array.from(document.querySelectorAll('input[name="chk_sup_hutang_item"]:checked')).map(c => c.value);
            (activeHutangSupplier?.debts || []).forEach(d => {
                if (hutangPayMode === 'checked' && !checkedIds.includes(d.id)) return;
                if ((Number(d.amount) || 0) <= 0) return;

                const paidAmt = Number(d.amount) || 0;
                d.amount = 0;
                d.status = 'Lunas';
                if (!Array.isArray(d.history)) d.history = [];
                d.history.push({
                    date: payDate,
                    paid: paidAmt,
                    remaining: 0,
                    by: 'Adm',
                    method: payMethod,
                    notes: payNotes
                });
            });

            alert("Pelunasan hutang sekaligus berhasil disimpan!");
            document.getElementById('view-lunasi-sekaligus-hutang').classList.add('hidden');
            document.getElementById('view-supplier-hutang').classList.remove('hidden');
            window.renderSupplierHutangTransactions();
        }
    };
})();
