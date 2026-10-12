// ============================================================================
// MODUL 7: MANAJEMEN HUTANG & PIUTANG - BAGIAN 1 (ALUR LENGKAP PIUTANG PELANGGAN)
// ============================================================================

(function() {
    // 1. HAPUS PLACEHOLDER KREDIT/PIUTANG LAMA JIKA ADA AGAR DIGANTIKAN VERSI PENUH INI
    const oldKpView = document.getElementById('view-kredit-piutang');
    if (oldKpView) oldKpView.remove();

    // 2. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN MENU UTAMA HUTANG DAN PIUTANG (SS 1000922544) === -->
        <div id="view-debts" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="switchView('pos')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Hutang dan Piutang</h2>
            </div>

            <div class="divide-y divide-gray-100">
                <!-- Menu Piutang -->
                <div onclick="openPiutangMainView()" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl">
                        <i class="fa-solid fa-file-pen"></i>
                    </div>
                    <span class="font-bold text-sm text-gray-900">Piutang</span>
                </div>

                <!-- Menu Hutang (Akan terhubung penuh ke modul-hutang.js) -->
                <div onclick="if(window.openHutangMainView) window.openHutangMainView(); else alert('Siap dihubungkan dengan screenshot menu Hutang selanjutnya.');" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl">
                        <i class="fa-solid fa-file-pen"></i>
                    </div>
                    <span class="font-bold text-sm text-gray-900">Hutang</span>
                </div>
            </div>
        </div>

        <!-- === 2. HALAMAN DAFTAR UTAMA PIUTANG (SS 1000922545 & 1000922546) === -->
        <div id="view-piutang-main" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <!-- Header Piutang + Ikon Lonceng Template Chat -->
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-3">
                    <button onclick="switchView('debts')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Piutang</h2>
                </div>
                <button onclick="openTemplateChatPiutangModal()" class="relative text-emerald-600 hover:text-emerald-800 p-1 transition" title="Template Chat Tagihan Piutang">
                    <span class="absolute -top-0.5 right-0 bg-red-600 text-white text-[8px] font-bold px-1 rounded">Chat</span>
                    <i class="fa-regular fa-bell text-xl"></i>
                </button>
            </div>

            <!-- Baris Sortir (3 Menu), Pencarian Nama, & Filter Jatuh Tempo -->
            <div class="p-3 bg-white flex items-center space-x-2 relative z-20">
                <div class="relative">
                    <button onclick="togglePiutangMainSortMenu()" class="text-emerald-700 text-xl px-2 py-1 focus:outline-none">
                        <i class="fa-solid fa-arrow-up-wide-short"></i>
                    </button>
                    <!-- Dropdown 3 Menu Sortir (SS 1000922546) -->
                    <div id="dropdown-piutang-main-sort" class="absolute left-0 top-10 w-52 bg-white rounded-md shadow-2xl border border-gray-200 py-1 hidden z-50 text-xs font-medium text-gray-900">
                        <button onclick="applyPiutangMainSort('due')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Jatuh Tempo Terdekat</button>
                        <button onclick="applyPiutangMainSort('name')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Nama</button>
                        <button onclick="applyPiutangMainSort('latest')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Transaksi Terbaru</button>
                    </div>
                </div>

                <!-- Kotak Cari Nama -->
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-700"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="piutang-main-search" oninput="renderPiutangMainList()" placeholder="Nama" class="w-full pl-9 pr-3 py-2.5 border border-emerald-600 rounded-lg text-xs font-medium text-gray-900 focus:outline-none">
                </div>

                <!-- Kotak Jatuh Tempo (Buka Popup Kalender - SS 1000922551) -->
                <div onclick="openPiutangCalendarModal('filter-main')" class="w-36 border border-gray-300 rounded-lg px-3 py-2.5 flex items-center space-x-2 cursor-pointer hover:border-emerald-600 transition bg-white">
                    <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                    <span id="label-piutang-main-due-filter" class="text-xs text-gray-500 truncate">Jatuh tempo</span>
                </div>
            </div>

            <!-- Konten Daftar Piutang -->
            <div class="flex-1 overflow-y-auto px-4 pb-24 space-y-4" onclick="hidePiutangMainSortMenu()">
                <!-- Kartu Gradasi Ringkasan Sisa Piutang -->
                <div class="bg-gradient-to-r from-amber-50/90 via-rose-50/80 to-pink-50/80 rounded-2xl p-4 flex items-center justify-between shadow-2xs border border-rose-100/60">
                    <div class="flex items-center space-x-3.5">
                        <div class="w-10 h-8 bg-red-500 rounded-md flex items-center px-1.5 shadow-xs">
                            <span class="w-2.5 h-2 bg-white rounded-xs block mt-2"></span>
                        </div>
                        <div>
                            <span class="text-xs text-gray-600 block">Sisa Piutang</span>
                            <span class="text-lg font-extrabold text-red-600 block mt-0.5" id="piutang-main-total-sisa">Rp 1.245.000</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="text-xs text-gray-600 block">Total Transaksi</span>
                        <span class="text-lg font-extrabold text-gray-900 block mt-0.5" id="piutang-main-total-trx">3</span>
                    </div>
                </div>

                <!-- Checkbox Filter Belum Lunas / Lunas -->
                <div class="flex items-center space-x-8 pt-1 text-xs font-bold text-gray-900">
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" id="chk-piutang-belum-lunas" checked onchange="renderPiutangMainList()" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span>Belum Lunas</span>
                    </label>
                    <label class="flex items-center space-x-2.5 cursor-pointer">
                        <input type="checkbox" id="chk-piutang-lunas" onchange="renderPiutangMainList()" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span>Lunas</span>
                    </label>
                </div>

                <!-- Baris Pelanggan yang Memiliki Piutang -->
                <div id="container-piutang-main-rows" class="divide-y divide-gray-100"></div>
            </div>

            <!-- Tombol Sticky Bawah: Tambah Piutang -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openTambahPiutangManualView()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs tracking-wide">
                    Tambah Piutang
                </button>
            </div>
        </div>

        <!-- === 3. HALAMAN TAMBAH PIUTANG MANUAL (SS 1000922552 & 1000922556) === -->
        <div id="view-tambah-piutang-manual" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeTambahPiutangManualView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Tambah Piutang</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28">
                <div class="bg-slate-50/80 border border-slate-100 rounded-2xl p-4 space-y-4">
                    <!-- Nominal -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nominal</label>
                        <div class="bg-white border border-gray-300 rounded-xl p-4 flex items-center justify-center">
                            <span class="text-2xl font-bold text-gray-900 mr-1">Rp</span>
                            <input type="number" id="input-manual-piutang-nominal" value="0" class="w-40 text-2xl font-bold text-gray-900 text-center focus:outline-none bg-transparent" pattern="[0-9]*" inputmode="numeric">
                        </div>
                    </div>

                    <!-- Pelanggan* (Tombol Pilih Pelanggan vs Nama Terpilih + X) -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Pelanggan<span class="text-red-500">*</span></label>
                        <!-- State Belum Pilih (SS 1000922552) -->
                        <div id="box-piutang-pick-cust-btn" onclick="openPilihPelangganPiutangView()" class="bg-white border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3 cursor-pointer hover:border-emerald-600 transition">
                            <i class="fa-solid fa-user text-emerald-600 text-base"></i>
                            <span class="text-xs font-bold text-gray-900">Pilih Pelanggan</span>
                        </div>
                        <!-- State Sudah Pilih (SS 1000922556) -->
                        <div id="box-piutang-selected-cust" class="hidden items-center justify-between py-2 px-1">
                            <span id="label-piutang-selected-cust-name" class="text-sm font-bold text-emerald-600">002 Bu Siti Majran</span>
                            <button onclick="clearSelectedCustomerForPiutang()" type="button" class="text-emerald-700 hover:text-red-600 text-xl px-1">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Jatuh Tempo -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Jatuh Tempo</label>
                        <div onclick="openPiutangCalendarModal('add-manual-due')" class="bg-white border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3 cursor-pointer hover:border-emerald-600 transition">
                            <i class="fa-regular fa-calendar text-gray-700 text-base"></i>
                            <input type="text" id="input-manual-piutang-due" value="19/10/2026" readonly class="flex-1 text-xs font-bold text-gray-900 bg-transparent focus:outline-none cursor-pointer">
                        </div>
                    </div>

                    <!-- Keterangan -->
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan</label>
                        <textarea id="input-manual-piutang-notes" rows="3" placeholder="Tulis keterangan" class="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"></textarea>
                    </div>

                    <!-- Ambil dari Cashdrawer -->
                    <div class="pt-1 pb-2 pl-2">
                        <label class="flex items-center space-x-3.5 cursor-pointer">
                            <input type="checkbox" id="chk-manual-piutang-cashdrawer" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Ambil dari Cashdrawer</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="saveManualPiutangBaru()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === 4. HALAMAN PILIH PELANGGAN (SS 1000922555) === -->
        <div id="view-pilih-pelanggan-piutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closePilihPelangganPiutangView()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pilih Pelanggan</h2>
            </div>

            <div class="p-3 bg-white border-b flex items-center space-x-2">
                <button onclick="togglePickCustomerSortOrder()" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-700"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="search-pick-cust-piutang" oninput="renderPilihPelangganPiutangList(this.value)" placeholder="Nama, email atau no telp" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
                <button onclick="if(window.openScannerView) window.openScannerView('customer-code')" class="text-emerald-700 text-2xl px-2"><i class="fa-solid fa-barcode"></i></button>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pb-28" id="container-pick-cust-piutang-rows"></div>

            <!-- Footer Tambah Pelanggan: Dari Kontak & Manual -->
            <div class="p-3 bg-white border-t absolute bottom-0 left-0 right-0 z-10 text-center space-y-2 shadow-lg">
                <span class="text-[11px] font-bold text-gray-800 block">Tambah Pelanggan</span>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="addCustomerFromContactPrompt()" type="button" class="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-full text-xs shadow-sm transition">
                        Dari Kontak
                    </button>
                    <button onclick="addCustomerManualPrompt()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-full text-xs shadow-sm transition">
                        Manual
                    </button>
                </div>
            </div>
        </div>

        <!-- === 5. HALAMAN KREDIT/PIUTANG PER PELANGGAN (SS 1000922564, 1000922568, 1000922569) === -->
        <div id="view-kredit-piutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-3">
                    <button onclick="closeKreditPiutangView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Kredit/Piutang</h2>
                </div>
                <!-- Ikon Share Kanan Atas -> Halaman Bagikan Pengingat (SS 1000922565) -->
                <button onclick="openBagikanPengingatView()" class="text-emerald-600 hover:text-emerald-800 text-xl p-1 transition" title="Bagikan Pengingat">
                    <i class="fa-solid fa-share-nodes"></i>
                </button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-24 space-y-4" onclick="hideKpSortDropdown()">
                <!-- Kartu Ringkasan Pelanggan -->
                <div class="bg-gradient-to-r from-amber-50/90 via-rose-50/80 to-pink-50/80 rounded-2xl p-4 space-y-3 shadow-2xs border border-rose-100/60">
                    <div class="flex items-center space-x-2.5">
                        <i class="fa-solid fa-user text-emerald-600 text-base"></i>
                        <span class="font-bold text-xs text-gray-900" id="kp-cust-name">MBG Ngroto</span>
                    </div>
                    <div class="flex justify-between items-center text-xs">
                        <div>
                            <span class="text-gray-600 block">Total Sisa Piutang</span>
                            <span class="font-extrabold text-red-600 text-base mt-0.5 block" id="kp-cust-debt-amount">Rp 1.030.000</span>
                        </div>
                        <div class="text-right">
                            <span class="text-gray-600 block">Total Transaksi</span>
                            <span class="font-extrabold text-gray-900 text-base mt-0.5 block" id="kp-cust-debt-count">2</span>
                        </div>
                    </div>
                    <div class="flex justify-center pt-1">
                        <button onclick="openPembayaranPiutangView('all')" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-12 rounded-full text-xs shadow-sm transition">
                            Lunasi Sekaligus
                        </button>
                    </div>
                </div>

                <!-- Baris Filter Urutan (2 Pilihan) & Kotak Semua Transaksi -->
                <div class="flex items-center space-x-2 relative z-20">
                    <div class="relative">
                        <button onclick="event.stopPropagation(); toggleKpSortDropdown()" type="button" class="text-emerald-700 text-lg px-2 py-1 focus:outline-none">
                            <i class="fa-solid fa-arrow-up-wide-short"></i>
                        </button>
                        <!-- Dropdown 2 Pilihan (SS 1000922568) -->
                        <div id="dropdown-kp-sort" class="absolute left-0 top-9 w-52 bg-white rounded-md shadow-2xl border border-gray-200 py-1 hidden z-50 text-xs font-medium text-gray-900">
                            <button onclick="applyKpTransactionSort('latest')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Transaksi Terbaru</button>
                            <button onclick="applyKpTransactionSort('due')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Jatuh Tempo Terdekat</button>
                        </div>
                    </div>

                    <!-- Kotak Semua Transaksi -> Buka Popup FILTER TANGGAL (SS 1000922566) -->
                    <div onclick="openFilterTanggalPiutangModal()" class="flex-1 border border-gray-300 rounded-xl p-3 flex justify-between items-center text-xs font-bold text-gray-900 cursor-pointer hover:border-emerald-600 transition bg-white">
                        <div class="flex items-center space-x-2.5">
                            <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                            <span id="label-kp-date-filter">Semua Transaksi</span>
                        </div>
                        <i class="fa-solid fa-chevron-down text-gray-700"></i>
                    </div>
                </div>

                <!-- Tombol Merah Buat Piutang -> Buka Popup TAMBAH PIUTANG (SS 1000922567) -->
                <button onclick="openPopupBuatPiutangPelanggan()" type="button" class="w-full border border-red-700 bg-rose-50/50 hover:bg-rose-50 text-red-700 font-semibold py-3 rounded-full text-xs transition">
                    Buat Piutang
                </button>

                <!-- Header Daftar Transaksi & Dropdown Belum Lunas -->
                <div class="flex justify-between items-center pt-2">
                    <label class="flex items-center space-x-3 text-xs font-bold text-gray-900 cursor-pointer">
                        <input type="checkbox" id="chk-kp-select-all" onchange="toggleSelectAllKpTransactions(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span>Daftar Transaksi</span>
                    </label>
                    <select id="select-kp-status-filter" onchange="renderCustomerPiutangTransactions()" class="border border-gray-300 rounded-xl px-3 py-2 text-xs font-semibold text-gray-900 bg-white focus:outline-none">
                        <option value="unpaid">Belum Lunas</option>
                        <option value="paid">Lunas</option>
                    </select>
                </div>

                <!-- Daftar Item Piutang Pelanggan -->
                <div id="container-cust-piutang-rows" class="divide-y divide-gray-100 pt-1"></div>
            </div>

            <!-- Bar Hijau Bawah Saat Ada Piutang yang Dicentang: Lunasi Sekaligus Rp ... (SS 1000922569) -->
            <div id="bar-kp-checked-lunasi" class="p-3 bg-white border-t absolute bottom-0 left-0 right-0 z-30 hidden">
                <button onclick="openPembayaranPiutangView('checked')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-5 rounded-md shadow-lg flex justify-between items-center text-xs transition active:scale-95">
                    <span>Lunasi Sekaligus</span>
                    <span id="label-kp-checked-total" class="font-extrabold">Rp 10.000</span>
                </button>
            </div>
        </div>

        <!-- === 6. HALAMAN BAGIKAN PENGINGAT (SS 1000922565) === -->
        <div id="view-bagikan-pengingat" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeBagikanPengingatView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Bagikan Pengingat</h2>
            </div>

            <div class="flex-1 overflow-y-auto flex flex-col justify-between pb-8">
                <div>
                    <!-- Area Abu-abu Kartu Visual Tagihan -->
                    <div class="bg-slate-50 p-6 flex justify-center">
                        <div class="w-full max-w-sm bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                            <!-- Header Kuning/Oranye Bergelombang -->
                            <div class="bg-gradient-to-br from-amber-400 to-amber-500 p-5 pb-8 text-white relative">
                                <div class="flex items-center space-x-3">
                                    <div class="w-12 h-12 rounded-full bg-white flex flex-col items-center justify-center text-gray-900 font-black text-[9px] leading-tight shadow-xs flex-shrink-0">
                                        <span class="text-red-600 text-sm font-extrabold">RL</span>
                                        <span>Rejeki</span>
                                        <span class="text-amber-600">Lancar</span>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-xs tracking-wide uppercase">REJEKI LANCAR</h4>
                                        <p class="text-xs font-semibold text-amber-50 mt-0.5">+6282232327343</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Isi Kartu Pengingat -->
                            <div class="p-6 text-center space-y-2">
                                <p class="text-xs font-semibold text-gray-600" id="card-reminder-title-text">Jangan Lupa Bayar</p>
                                <p class="text-2xl font-extrabold text-emerald-600 py-1" id="card-reminder-amount">Rp 1.030.000</p>
                                <div class="border-t border-gray-200 pt-3 mt-2">
                                    <p class="font-bold text-xs text-gray-900" id="card-reminder-cust-name">MBG Ngroto</p>
                                </div>
                                <div class="pt-4 text-left flex items-center space-x-1.5 text-[10px] text-gray-500">
                                    <span>Powered by:</span>
                                    <span class="inline-flex items-center font-bold text-emerald-700"><i class="fa-solid fa-cash-register mr-1"></i>REJEKI<span class="text-amber-500">LANCAR</span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Input Edit Teks Pengingat & Checkbox Template -->
                    <div class="p-5 space-y-5">
                        <div class="flex items-center space-x-3">
                            <input type="text" id="input-reminder-custom-title" value="Jangan Lupa Bayar" oninput="document.getElementById('card-reminder-title-text').innerText = this.value || 'Jangan Lupa Bayar'" class="flex-1 border-b border-gray-400 pb-1.5 text-sm text-gray-700 focus:outline-none focus:border-emerald-600">
                            <button onclick="document.getElementById('input-reminder-custom-title').focus()" type="button" class="text-emerald-700 text-xl">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                        </div>

                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-reminder-use-template" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Gunakan Teks Template</span>
                        </label>
                    </div>
                </div>

                <!-- Tombol Share Bawah: WhatsApp, SMS, Email -->
                <div class="flex items-center justify-center space-x-8 pt-6">
                    <button onclick="shareReminderAction('wa')" type="button" class="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-2xl shadow-md transition">
                        <i class="fa-brands fa-whatsapp"></i>
                    </button>
                    <button onclick="shareReminderAction('sms')" type="button" class="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-xl shadow-md transition">
                        <i class="fa-solid fa-comment-dots"></i>
                    </button>
                    <button onclick="shareReminderAction('email')" type="button" class="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center text-xl shadow-md transition">
                        <i class="fa-regular fa-envelope"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- === 7. HALAMAN DETAIL PIUTANG & HISTORY PEMBAYARAN (SS 1000922570) === -->
        <div id="view-detail-piutang-item" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeDetailPiutangItemView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Kredit/Piutang</h2>
                </div>
                <button onclick="openBagikanPengingatView()" class="text-emerald-600 text-xl p-1"><i class="fa-solid fa-share-nodes"></i></button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-4 text-xs">
                <div class="flex items-center space-x-2.5">
                    <i class="fa-solid fa-user text-emerald-600 text-base"></i>
                    <span class="font-bold text-gray-900" id="det-piutang-cust-name">MBG Ngroto</span>
                </div>

                <div class="flex items-center space-x-2 pt-1">
                    <span id="det-piutang-status-dot" class="w-2.5 h-2.5 rounded-full bg-red-700"></span>
                    <span id="det-piutang-status-text" class="font-bold text-gray-900">Belum lunas</span>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-1">
                    <div>
                        <span class="text-gray-500 block">Tanggal Transaksi</span>
                        <span class="font-bold text-gray-900 block mt-0.5" id="det-piutang-trx-date">2026-10-12 11:42:02</span>
                    </div>
                    <div class="text-right">
                        <span class="text-gray-500 block">Jatuh Tempo</span>
                        <span class="font-bold text-gray-900 block mt-0.5" id="det-piutang-due-date">2026/10/22</span>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4 pt-1">
                    <div>
                        <span class="text-gray-500 block">Total Piutang</span>
                        <span class="font-bold text-gray-900 block mt-0.5" id="det-piutang-total">Rp 10.000</span>
                    </div>
                    <div class="text-right">
                        <span class="text-gray-500 block">Belum dibayar</span>
                        <span class="font-bold text-red-500 block mt-0.5" id="det-piutang-unpaid">Rp 10.000</span>
                    </div>
                </div>

                <!-- Tombol Lihat Detail Struk -> Buka Struk Digital -->
                <div onclick="openStrukFromDetailPiutang()" class="bg-slate-100/90 hover:bg-slate-200/80 p-3.5 px-4 rounded-xl flex justify-between items-center cursor-pointer transition mt-2">
                    <span class="font-bold text-gray-900">Lihat detail struk</span>
                    <i class="fa-solid fa-chevron-right text-gray-800 text-sm"></i>
                </div>

                <div class="text-center font-bold text-gray-900 pt-2">
                    History pembayaran
                </div>

                <!-- Daftar Kartu History Pembayaran / Cicilan -->
                <div id="container-det-piutang-history" class="space-y-3"></div>
            </div>

            <!-- Tombol Sticky Bawah: PEMBAYARAN -->
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openPembayaranPiutangView('single')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    PEMBAYARAN
                </button>
            </div>
        </div>

        <!-- === 8. HALAMAN PEMBAYARAN PIUTANG (SS 1000922572) === -->
        <div id="view-pembayaran-piutang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closePembayaranPiutangView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pembayaran Piutang</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 pb-28 space-y-4">
                <div class="flex justify-between items-start text-xs px-1">
                    <div class="flex items-center space-x-2.5">
                        <i class="fa-solid fa-user text-emerald-600 text-base"></i>
                        <span class="font-bold text-gray-900" id="pay-piutang-cust-name">MBG Ngroto</span>
                    </div>
                    <div class="text-right">
                        <span class="text-gray-600 font-semibold block">Belum dibayar</span>
                        <span class="text-sm font-extrabold text-red-600 block mt-0.5" id="pay-piutang-unpaid-disp">Rp 10.000</span>
                    </div>
                </div>

                <div class="bg-slate-50/90 border border-slate-100 rounded-2xl p-4 space-y-4">
                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Nominal<span class="text-red-500">*</span></label>
                        <div class="bg-white border border-emerald-600 rounded-xl p-4 flex items-center justify-center">
                            <span class="text-2xl font-extrabold text-gray-900 mr-1">Rp</span>
                            <input type="number" id="input-pay-piutang-nominal" value="0" class="w-40 text-2xl font-extrabold text-gray-900 text-center focus:outline-none bg-transparent" pattern="[0-9]*" inputmode="numeric">
                        </div>
                    </div>

                    <!-- Checkbox Lunasi -->
                    <div>
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-pay-piutang-lunasi" onchange="toggleLunasiFullPiutang(this.checked)" class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Lunasi</span>
                        </label>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Pembayaran</label>
                        <div class="bg-white border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3">
                            <i class="fa-regular fa-calendar text-gray-700 text-base"></i>
                            <input type="text" id="input-pay-piutang-date" class="flex-1 text-xs font-bold text-gray-900 bg-transparent focus:outline-none">
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Metode Pembayaran</label>
                        <div class="relative">
                            <select id="select-pay-piutang-method" class="w-full bg-white border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 appearance-none focus:outline-none focus:border-emerald-600">
                                <option value="Cash">Cash</option>
                                <option value="Transfer Bank">Transfer Bank</option>
                                <option value="QRIS">QRIS</option>
                            </select>
                            <i class="fa-solid fa-chevron-down text-gray-700 text-xs absolute right-4 top-3.5 pointer-events-none"></i>
                        </div>
                    </div>

                    <div>
                        <label class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan</label>
                        <textarea id="input-pay-piutang-notes" rows="3" placeholder="Tulis keterangan" class="w-full bg-white border border-gray-300 rounded-xl p-3 text-xs text-gray-900 focus:outline-none focus:border-emerald-600"></textarea>
                    </div>

                    <div class="pt-1 pb-1 pl-1">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-pay-piutang-cashdrawer" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                            <span class="text-xs font-bold text-gray-900">Masukkan ke Cashdrawer</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="submitPembayaranPiutang()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>
    `;

    // 3. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <!-- === POPUP TEMPLATE CHAT PIUTANG SIAP COPY (TANPA BLAZWA - SS 1000922550) === -->
        <div id="modal-template-chat-piutang" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 text-center pb-3 border-b">TEMPLATE CHAT PIUTANG</h3>

                <!-- Pilihan Pelanggan agar Template Langsung Terisi Sesuai Nama Pelanggan -->
                <div>
                    <label class="block text-[11px] font-semibold text-gray-500 mb-1">Pilih Pelanggan (Otomatis Isi Nama & Tagihan):</label>
                    <select id="select-template-piutang-cust" onchange="updateTemplateChatPiutangPreview()" class="w-full border border-emerald-600 rounded-full px-3.5 py-2 text-xs font-bold text-gray-900 bg-white focus:outline-none"></select>
                </div>

                <div id="box-template-chat-piutang-text" class="text-xs text-gray-800 space-y-3 leading-relaxed bg-gray-50 p-3.5 rounded-2xl border border-gray-100 whitespace-pre-line font-medium"></div>

                <div class="space-y-2.5 pt-2">
                    <button onclick="copyTemplateChatPiutang()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">
                        COPY TEMPLATE
                    </button>
                    <button onclick="closeTemplateChatPiutangModal()" type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">
                        TUTUP
                    </button>
                </div>
            </div>
        </div>

        <!-- === POPUP KALENDER JATUH TEMPO (SS 1000922551) === -->
        <div id="modal-piutang-calendar" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-md w-full max-w-xs overflow-hidden shadow-2xl">
                <div class="bg-emerald-600 text-white p-5">
                    <span class="text-xs text-emerald-100 block" id="cal-header-year">2026</span>
                    <h3 class="text-2xl font-bold mt-0.5" id="cal-header-date-str">Sen, 12 Okt</h3>
                </div>
                <div class="p-4">
                    <div class="flex justify-between items-center mb-4 px-2">
                        <button onclick="changePiutangCalendarMonth(-1)" type="button" class="text-gray-700 hover:text-black p-1"><i class="fa-solid fa-chevron-left text-xs"></i></button>
                        <span class="text-xs font-bold text-gray-800" id="cal-month-year-label">Oktober 2026</span>
                        <button onclick="changePiutangCalendarMonth(1)" type="button" class="text-gray-700 hover:text-black p-1"><i class="fa-solid fa-chevron-right text-xs"></i></button>
                    </div>
                    <div class="grid grid-cols-7 text-center text-[11px] font-semibold text-gray-400 mb-2">
                        <span>M</span><span>S</span><span>S</span><span>R</span><span>K</span><span>J</span><span>S</span>
                    </div>
                    <div id="cal-days-grid" class="grid grid-cols-7 text-center text-xs gap-y-1"></div>
                    <div class="flex justify-end space-x-6 mt-5 pt-2 px-2 text-xs font-bold text-emerald-600">
                        <button onclick="resetPiutangCalendarFilter()" type="button">BATAL</button>
                        <button onclick="confirmPiutangCalendarDate()" type="button">OKE</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- === POPUP FILTER TANGGAL KREDIT/PIUTANG (SS 1000922566) === -->
        <div id="modal-kp-filter-tanggal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 text-center pb-3 border-b">FILTER TANGGAL</h3>
                <p class="text-xs font-bold text-gray-900">Filter berdasarkan</p>
                <div class="flex items-center space-x-6 text-xs font-semibold text-gray-900">
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="kp_date_filter_type" value="trx" checked class="w-5 h-5 text-emerald-600 focus:ring-emerald-500">
                        <span>Tgl Transaksi</span>
                    </label>
                    <label class="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name="kp_date_filter_type" value="due" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500">
                        <span>Jatuh Tempo</span>
                    </label>
                </div>
                <div onclick="applyKpDateRangeQuickFilter()" class="border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3 cursor-pointer hover:border-emerald-600">
                    <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                    <span class="text-xs font-semibold text-gray-800">Rentang Tanggal</span>
                </div>
                <button onclick="closeFilterTanggalPiutangModal()" type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase mt-2">
                    BATAL
                </button>
            </div>
        </div>

        <!-- === POPUP TAMBAH PIUTANG DI DALAM PELANGGAN (SS 1000922567) === -->
        <div id="modal-kp-tambah-piutang" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-3.5 text-xs">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 text-center pb-3 border-b">TAMBAH PIUTANG</h3>
                <div>
                    <label class="block font-semibold text-gray-600 mb-1">Besar Piutang<span class="text-red-500">*</span></label>
                    <input type="number" id="input-popup-kp-amount" class="w-full border border-gray-300 rounded-full p-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                </div>
                <div>
                    <label class="block font-semibold text-gray-600 mb-1">Tanggal Jatuh Tempo</label>
                    <div onclick="openPiutangCalendarModal('popup-kp-due')" class="border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3 cursor-pointer">
                        <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                        <input type="text" id="input-popup-kp-due" value="19/10/2026" readonly class="flex-1 font-semibold text-gray-800 bg-transparent focus:outline-none cursor-pointer">
                    </div>
                </div>
                <div>
                    <label class="block font-semibold text-gray-600 mb-1">Keterangan</label>
                    <input type="text" id="input-popup-kp-notes" class="w-full border border-gray-300 rounded-full p-3 px-4 text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div class="pt-1 pl-2">
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="chk-popup-kp-cashdrawer" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300">
                        <span class="font-bold text-gray-900">Ambil dari Cashdrawer</span>
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <button onclick="closePopupBuatPiutangPelanggan()" type="button" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase">BATAL</button>
                    <button onclick="savePopupBuatPiutangPelanggan()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md">SIMPAN</button>
                </div>
            </div>
        </div>

        <!-- === POPUP EDIT RIWAYAT CICILAN PIUTANG (SS 1000922571) === -->
        <div id="modal-edit-riwayat-piutang" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-3.5 text-xs">
                <h3 class="font-extrabold text-sm text-gray-900 text-center pb-3 border-b">Edit Riwayat</h3>
                <div>
                    <label class="block font-semibold text-gray-600 mb-1">Tanggal Pembayaran</label>
                    <div class="border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3">
                        <i class="fa-regular fa-calendar text-emerald-700 text-base"></i>
                        <input type="text" id="edit-hist-piutang-date" class="flex-1 font-semibold text-gray-800 focus:outline-none">
                    </div>
                </div>
                <div>
                    <label class="block font-semibold text-gray-600 mb-1">Yang dibayarkan</label>
                    <input type="number" id="edit-hist-piutang-amount" class="w-full border border-gray-300 rounded-full p-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600" pattern="[0-9]*" inputmode="numeric">
                </div>
                <div>
                    <label class="block font-semibold text-gray-600 mb-1">Metode Pembayaran</label>
                    <div class="relative">
                        <select id="edit-hist-piutang-method" class="w-full border border-gray-300 rounded-full p-3 px-4 font-bold text-gray-900 bg-white appearance-none focus:outline-none">
                            <option value="Cash">Cash</option>
                            <option value="Transfer Bank">Transfer Bank</option>
                            <option value="QRIS">QRIS</option>
                        </select>
                        <i class="fa-solid fa-chevron-down text-emerald-600 text-xs absolute right-4 top-3.5 pointer-events-none"></i>
                    </div>
                </div>
                <div>
                    <label class="block font-semibold text-gray-600 mb-1">Keterangan</label>
                    <textarea id="edit-hist-piutang-notes" rows="2" placeholder="Tulis keterangan" class="w-full border border-gray-300 rounded-xl p-3 text-gray-900 focus:outline-none focus:border-emerald-600"></textarea>
                </div>
                <div class="pt-1 pl-1">
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="edit-hist-piutang-shift" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300">
                        <span class="font-bold text-gray-900">Catat di Rekap Shift</span>
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <button onclick="closeEditRiwayatPiutangModal()" type="button" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase">BATAL</button>
                    <button onclick="saveEditRiwayatPiutangModal()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md">SIMPAN</button>
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
    // 4. DATA AWAL PELANGGAN & PIUTANG SESUAI SCREENSHOT (SS 1000922545 - 1000922572)
    // ========================================================================
    const defaultPiutangCustomers = [
        {
            id: "cust_mbg",
            avatarCode: "MB",
            name: "MBG Ngroto",
            code: "1-099",
            points: 0,
            tier: "-",
            email: "",
            phone: "8123456789",
            address: "Ngroto, Pujon",
            piutangList: [
                {
                    id: "piu_mbg_1",
                    trxDate: "2026-02-23 09:15:00",
                    shortDate: "23/02/2026",
                    dueDate: "2026/03/02",
                    totalAmount: 1020000,
                    unpaidAmount: 1020000,
                    status: "Belum lunas",
                    notes: "Piutang Belanja Kemasan",
                    receiptNo: "20260223091500",
                    history: [
                        { id: "h_1", date: "2026-02-23 00:00:00", paid: 0, remaining: 1020000, receiptNo: "20260223091500", by: "Adm", method: "Cash", notes: "" }
                    ]
                },
                {
                    id: "piu_mbg_2",
                    trxDate: "2026-10-12 11:42:02",
                    shortDate: "12/10/2026",
                    dueDate: "2026/10/22",
                    totalAmount: 10000,
                    unpaidAmount: 10000,
                    status: "Belum lunas",
                    notes: "Piutang Tambahan",
                    receiptNo: "20261012114202",
                    history: [
                        { id: "h_2", date: "2026-10-12 00:00:00", paid: 0, remaining: 10000, receiptNo: "20261012114202", by: "Adm", method: "Cash", notes: "" }
                    ]
                }
            ]
        },
        {
            id: "cust_198",
            avatarCode: "19",
            name: "198 Mas Uus SelepPentol",
            code: "1-198",
            points: 240,
            tier: "-",
            email: "",
            phone: "857123456",
            address: "Pujon",
            piutangList: [
                {
                    id: "piu_198_1",
                    trxDate: "2026-02-26 10:20:00",
                    shortDate: "26/02/2026",
                    dueDate: "2026/03/05",
                    totalAmount: 13000,
                    unpaidAmount: 13000,
                    status: "Belum lunas",
                    notes: "Plastik Pentol",
                    receiptNo: "20260226102000",
                    history: [
                        { id: "h_3", date: "2026-02-26 00:00:00", paid: 0, remaining: 13000, receiptNo: "20260226102000", by: "Adm", method: "Cash", notes: "" }
                    ]
                }
            ]
        },
        {
            id: "cust_065",
            avatarCode: "06",
            name: "065 Farida Kopi",
            code: "1-065",
            points: 510,
            tier: "-",
            email: "",
            phone: "8133344455",
            address: "Pujon",
            piutangList: [
                {
                    id: "piu_065_1",
                    trxDate: "2026-10-10 14:10:00",
                    shortDate: "10/10/2026",
                    dueDate: "2026/10/17",
                    totalAmount: 212000,
                    unpaidAmount: 212000,
                    status: "Belum lunas",
                    notes: "Cup & Sedotan Kopi",
                    receiptNo: "20261010141000",
                    history: [
                        { id: "h_4", date: "2026-10-10 00:00:00", paid: 0, remaining: 212000, receiptNo: "20261010141000", by: "Adm", method: "Cash", notes: "" }
                    ]
                }
            ]
        },
        // Daftar Pelanggan dari SS 1000922555 (Pilih Pelanggan)
        { id: "cust_001", avatarCode: "00", name: "001 Mb Mei Ayam Sebaluh", code: "1", points: 6046, tier: "gold", phone: "81230001", address: "Sebaluh", piutangList: [] },
        { id: "cust_002", avatarCode: "00", name: "002 Bu Siti Majran", code: "89", points: 6671, tier: "-", phone: "81230002", address: "Majran", piutangList: [] },
        { id: "cust_003", avatarCode: "00", name: "003 Bu Ani Ngroto", code: "85", points: 389, tier: "-", phone: "81230003", address: "Ngroto", piutangList: [] },
        { id: "cust_004", avatarCode: "00", name: "004 Bu iin Sebaluh", code: "624", points: 0, tier: "-", phone: "81230004", address: "Sebaluh", piutangList: [] },
        { id: "cust_005", avatarCode: "00", name: "005 Bu Evi Pandesari", code: "85", points: 8308, tier: "-", phone: "81230005", address: "Pandesari", piutangList: [] },
        { id: "cust_006", avatarCode: "00", name: "006 Cipoet Pandesari", code: "85", points: 1799, tier: "-", phone: "81230006", address: "Pandesari", piutangList: [] },
        { id: "cust_007", avatarCode: "00", name: "007 Dejavu Cafe", code: "85", points: 9948, tier: "-", phone: "81230007", address: "Pujon", piutangList: [] },
        { id: "cust_008", avatarCode: "00", name: "008 Eko Persil", code: "81", points: 12260, tier: "-", phone: "81230008", address: "Persil", piutangList: [] },
        { id: "cust_009", avatarCode: "00", name: "009 Yepi Gerih", code: "85", points: 2136, tier: "-", phone: "81230009", address: "Gerih", piutangList: [] },
        { id: "cust_010", avatarCode: "01", name: "010 Santera Gudang", code: "6285", points: 22275, tier: "-", phone: "81230010", address: "Santera", piutangList: [] }
    ];

    // Gabungkan ke window.customersList agar terintegrasi dengan modul-relasi.js
    if (!window.customersList) window.customersList = [];
    defaultPiutangCustomers.forEach(dc => {
        const ex = window.customersList.find(c => c.name === dc.name);
        if (!ex) {
            window.customersList.push(dc);
        } else if (!ex.piutangList || ex.piutangList.length === 0) {
            ex.piutangList = dc.piutangList;
        }
    });

    // State Navigasi & Seleksi
    let piutangMainSortBy = 'due'; // 'due', 'name', 'latest'
    let piutangMainDueFilter = '';
    let selectedCustForManualPiutang = null;
    let pickCustSortAsc = true;

    let activeKpCustomer = window.customersList[0];
    let kpReturnView = 'view-piutang-main';
    let kpSortBy = 'latest';
    let activePiutangItem = null;
    let activeEditingHistoryIdx = 0;
    let paymentTargetMode = 'single'; // 'single', 'checked', 'all'
    let currentPayTargetAmount = 0;

    // State Kalender
    let calTargetMode = 'filter-main';
    let calCurrentYear = 2026;
    let calCurrentMonth = 9; // Oktober (0-based = 9)
    let calSelectedDay = 12;

    // Hook pada switchView('debts') agar header utama disembunyikan
    const prevSwitchView = window.switchView;
    window.switchView = function(viewName) {
        if (typeof prevSwitchView === 'function') prevSwitchView(viewName);
        if (viewName === 'debts') {
            const mainHeader = document.getElementById('main-header');
            if (mainHeader) mainHeader.classList.add('hidden');
        }
    };

    // ========================================================================
    // 5. LOGIKA HALAMAN UTAMA PIUTANG (SS 1000922545 - 1000922551)
    // ========================================================================
    window.openPiutangMainView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-piutang-main').classList.remove('hidden');
        window.renderPiutangMainList();
    };

    window.togglePiutangMainSortMenu = () => {
        document.getElementById('dropdown-piutang-main-sort').classList.toggle('hidden');
    };
    window.hidePiutangMainSortMenu = () => {
        const el = document.getElementById('dropdown-piutang-main-sort');
        if (el) el.classList.add('hidden');
    };
    window.applyPiutangMainSort = (mode) => {
        piutangMainSortBy = mode;
        window.hidePiutangMainSortMenu();
        window.renderPiutangMainList();
    };

    window.renderPiutangMainList = function() {
        const container = document.getElementById('container-piutang-main-rows');
        if (!container) return;
        container.innerHTML = '';

        const keyword = (document.getElementById('piutang-main-search')?.value || '').toLowerCase();
        const showUnpaid = document.getElementById('chk-piutang-belum-lunas')?.checked !== false;
        const showPaid = document.getElementById('chk-piutang-lunas')?.checked === true;

        // Kumpulkan per pelanggan yang memiliki piutang
        let custSummaries = [];
        let grandTotalSisa = 0;
        let grandTotalTrx = 0;

        (window.customersList || []).forEach(c => {
            const list = c.piutangList || [];
            if (list.length === 0) return;

            const matchingItems = list.filter(item => {
                const isUnpaid = (Number(item.unpaidAmount) || 0) > 0;
                if (isUnpaid && !showUnpaid) return false;
                if (!isUnpaid && !showPaid) return false;
                if (piutangMainDueFilter && item.dueDate !== piutangMainDueFilter) return false;
                return true;
            });

            if (matchingItems.length === 0) return;
            if (keyword && !c.name.toLowerCase().includes(keyword)) return;

            const totalPiutangCust = matchingItems.reduce((acc, x) => acc + (Number(x.totalAmount) || 0), 0);
            const sisaPiutangCust = matchingItems.reduce((acc, x) => acc + (Number(x.unpaidAmount) || 0), 0);
            const nearestDue = matchingItems[0].dueDate || '2026/10/17';
            const latestTrx = matchingItems[matchingItems.length - 1].trxDate || '';

            grandTotalSisa += sisaPiutangCust;
            grandTotalTrx += 1;

            custSummaries.push({
                cust: c,
                nearestDue,
                latestTrx,
                totalPiutangCust,
                sisaPiutangCust,
                isUnpaid: sisaPiutangCust > 0
            });
        });

        // Sortir sesuai pilihan
        custSummaries.sort((a, b) => {
            if (piutangMainSortBy === 'name') return a.cust.name.localeCompare(b.cust.name);
            if (piutangMainSortBy === 'latest') return b.latestTrx.localeCompare(a.latestTrx);
            return a.nearestDue.localeCompare(b.nearestDue);
        });

        document.getElementById('piutang-main-total-sisa').innerText = `Rp ${grandTotalSisa.toLocaleString('id-ID')}`;
        document.getElementById('piutang-main-total-trx').innerText = grandTotalTrx;

        if (custSummaries.length === 0) {
            container.innerHTML = `<div class="py-12 text-center text-xs text-gray-400 font-semibold">Tidak ada data piutang yang sesuai filter.</div>`;
            return;
        }

        custSummaries.forEach((row, idx) => {
            const statusDot = row.isUnpaid ? 'bg-red-700' : 'bg-emerald-600';
            const statusLabel = row.isUnpaid ? 'Belum Lunas' : 'Lunas';

            container.innerHTML += `
                <div onclick="openCustomerKreditPiutangFromMain('${row.cust.id}')" class="py-3.5 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition text-xs">
                    <div class="flex items-start space-x-3">
                        <span class="text-gray-500 font-semibold pt-0.5">${idx + 1}.</span>
                        <div class="space-y-0.5">
                            <h4 class="font-extrabold text-gray-900 text-xs">${row.cust.name}</h4>
                            <p class="text-[11px] text-gray-600 font-medium">JT: ${row.nearestDue}</p>
                            <p class="text-[11px] font-bold text-emerald-600">Rp ${row.totalPiutangCust.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    <div class="text-right space-y-1">
                        <span class="inline-flex items-center font-semibold text-gray-900 text-[11px]">
                            <span class="w-2.5 h-2.5 rounded-full ${statusDot} mr-1.5"></span>${statusLabel}
                        </span>
                        <p class="font-bold text-red-700 text-xs">Rp ${row.sisaPiutangCust.toLocaleString('id-ID')}</p>
                    </div>
                </div>
            `;
        });
    };

    // --- POPUP TEMPLATE CHAT PIUTANG (IKON LONCENG - SS 1000922550) ---
    window.openTemplateChatPiutangModal = () => {
        const sel = document.getElementById('select-template-piutang-cust');
        sel.innerHTML = `<option value="raw">Format Standar ({nick_name}, {var_1}, {var_2})</option>`;
        (window.customersList || []).forEach(c => {
            const sisa = (c.piutangList || []).reduce((s, x) => s + (Number(x.unpaidAmount) || 0), 0);
            if (sisa > 0) {
                sel.innerHTML += `<option value="${c.id}">${c.name} - Rp ${sisa.toLocaleString('id-ID')}</option>`;
            }
        });
        window.updateTemplateChatPiutangPreview();
        document.getElementById('modal-template-chat-piutang').classList.remove('hidden');
    };

    window.closeTemplateChatPiutangModal = () => {
        document.getElementById('modal-template-chat-piutang').classList.add('hidden');
    };

    window.updateTemplateChatPiutangPreview = () => {
        const val = document.getElementById('select-template-piutang-cust').value;
        let nickName = '{nick_name}';
        let namaToko = '[namatoko]';
        let var1 = '{var_1}';
        let var2 = '{var_2}';

        if (val !== 'raw') {
            const c = (window.customersList || []).find(x => x.id === val);
            if (c) {
                nickName = c.name;
                namaToko = 'REJEKI LANCAR';
                const sisa = (c.piutangList || []).reduce((s, x) => s + (Number(x.unpaidAmount) || 0), 0);
                var1 = sisa.toLocaleString('id-ID');
                var2 = (c.piutangList && c.piutangList[0]?.dueDate) || '2026/10/22';
            }
        }

        const text = `Halo ${nickName}, semoga harimu menyenangkan! 🙏\n\nKami dari ${namaToko} ingin menginformasikan bahwa saat ini terdapat tagihan yang masih berjalan:\n\n📌 Total Tagihan: Rp ${var1}\n📅 Jatuh Tempo: ${var2}\n\nMohon konfirmasi jika pembayaran sudah dilakukan ya, atau jika ada pertanyaan bisa balas chat ini 😊\n\nTerima kasih atas kepercayaannya telah berbelanja di Toko kami 🙇‍♂️`;
        document.getElementById('box-template-chat-piutang-text').innerText = text;
    };

    window.copyTemplateChatPiutang = () => {
        const text = document.getElementById('box-template-chat-piutang-text').innerText;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text);
        }
        alert("Template Chat Piutang berhasil disalin (dicopy)!");
        window.closeTemplateChatPiutangModal();
    };

    // --- POPUP KALENDER TANGGAL (SS 1000922551) ---
    const indoMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    const shortIndoMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const shortIndoDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    window.openPiutangCalendarModal = (target) => {
        calTargetMode = target;
        renderPiutangCalendarGrid();
        document.getElementById('modal-piutang-calendar').classList.remove('hidden');
    };

    window.changePiutangCalendarMonth = (delta) => {
        calCurrentMonth += delta;
        if (calCurrentMonth < 0) { calCurrentMonth = 11; calCurrentYear--; }
        if (calCurrentMonth > 11) { calCurrentMonth = 0; calCurrentYear++; }
        renderPiutangCalendarGrid();
    };

    function renderPiutangCalendarGrid() {
        document.getElementById('cal-header-year').innerText = calCurrentYear;
        const selDateObj = new Date(calCurrentYear, calCurrentMonth, calSelectedDay);
        const dayName = shortIndoDays[selDateObj.getDay()];
        document.getElementById('cal-header-date-str').innerText = `${dayName}, ${calSelectedDay} ${shortIndoMonths[calCurrentMonth]}`;
        document.getElementById('cal-month-year-label').innerText = `${indoMonths[calCurrentMonth]} ${calCurrentYear}`;

        const firstDay = new Date(calCurrentYear, calCurrentMonth, 1).getDay();
        const daysInMonth = new Date(calCurrentYear, calCurrentMonth + 1, 0).getDate();

        const grid = document.getElementById('cal-days-grid');
        grid.innerHTML = '';

        for (let i = 0; i < firstDay; i++) {
            grid.innerHTML += `<div></div>`;
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const isSelected = d === calSelectedDay;
            const btnClass = isSelected
                ? 'w-8 h-8 mx-auto rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center'
                : 'w-8 h-8 mx-auto rounded-full text-gray-800 hover:bg-gray-100 flex items-center justify-center';
            grid.innerHTML += `
                <button onclick="selectPiutangCalendarDay(${d})" type="button" class="${btnClass}">${d}</button>
            `;
        }
    }

    window.selectPiutangCalendarDay = (d) => {
        calSelectedDay = d;
        renderPiutangCalendarGrid();
    };

    window.resetPiutangCalendarFilter = () => {
        if (calTargetMode === 'filter-main') {
            piutangMainDueFilter = '';
            document.getElementById('label-piutang-main-due-filter').innerText = 'Jatuh tempo';
            window.renderPiutangMainList();
        }
        document.getElementById('modal-piutang-calendar').classList.add('hidden');
    };

    window.confirmPiutangCalendarDate = () => {
        const pad = (n) => n.toString().padStart(2, '0');
        const slashYYYYMMDD = `${calCurrentYear}/${pad(calCurrentMonth + 1)}/${pad(calSelectedDay)}`;
        const slashDDMMYYYY = `${pad(calSelectedDay)}/${pad(calCurrentMonth + 1)}/${calCurrentYear}`;

        if (calTargetMode === 'filter-main') {
            piutangMainDueFilter = slashYYYYMMDD;
            document.getElementById('label-piutang-main-due-filter').innerText = slashDDMMYYYY;
            window.renderPiutangMainList();
        } else if (calTargetMode === 'add-manual-due') {
            document.getElementById('input-manual-piutang-due').value = slashDDMMYYYY;
        } else if (calTargetMode === 'popup-kp-due') {
            document.getElementById('input-popup-kp-due').value = slashDDMMYYYY;
        }
        document.getElementById('modal-piutang-calendar').classList.add('hidden');
    };

    // ========================================================================
    // 6. TAMBAH PIUTANG MANUAL & PILIH PELANGGAN (SS 1000922552 - 1000922556)
    // ========================================================================
    window.openTambahPiutangManualView = () => {
        selectedCustForManualPiutang = null;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-tambah-piutang-manual').classList.remove('hidden');

        document.getElementById('input-manual-piutang-nominal').value = '0';
        document.getElementById('input-manual-piutang-due').value = '19/10/2026';
        document.getElementById('input-manual-piutang-notes').value = '';
        document.getElementById('chk-manual-piutang-cashdrawer').checked = true;
        updateSelectedCustomerForPiutangUI();
    };

    window.closeTambahPiutangManualView = () => {
        document.getElementById('view-tambah-piutang-manual').classList.add('hidden');
        document.getElementById('view-piutang-main').classList.remove('hidden');
        window.renderPiutangMainList();
    };

    function updateSelectedCustomerForPiutangUI() {
        const btnPick = document.getElementById('box-piutang-pick-cust-btn');
        const boxSelected = document.getElementById('box-piutang-selected-cust');
        const lblName = document.getElementById('label-piutang-selected-cust-name');

        if (selectedCustForManualPiutang) {
            btnPick.classList.add('hidden');
            boxSelected.classList.remove('hidden');
            boxSelected.classList.add('flex');
            lblName.innerText = selectedCustForManualPiutang.name;
        } else {
            btnPick.classList.remove('hidden');
            boxSelected.classList.add('hidden');
            boxSelected.classList.remove('flex');
        }
    }

    window.clearSelectedCustomerForPiutang = () => {
        selectedCustForManualPiutang = null;
        updateSelectedCustomerForPiutangUI();
    };

    window.openPilihPelangganPiutangView = () => {
        document.getElementById('view-tambah-piutang-manual').classList.add('hidden');
        document.getElementById('view-pilih-pelanggan-piutang').classList.remove('hidden');
        document.getElementById('search-pick-cust-piutang').value = '';
        window.renderPilihPelangganPiutangList('');
    };

    window.closePilihPelangganPiutangView = () => {
        document.getElementById('view-pilih-pelanggan-piutang').classList.add('hidden');
        document.getElementById('view-tambah-piutang-manual').classList.remove('hidden');
    };

    window.togglePickCustomerSortOrder = () => {
        pickCustSortAsc = !pickCustSortAsc;
        window.renderPilihPelangganPiutangList(document.getElementById('search-pick-cust-piutang').value);
    };

    window.renderPilihPelangganPiutangList = function(keyword = '') {
        const container = document.getElementById('container-pick-cust-piutang-rows');
        if (!container) return;
        container.innerHTML = '';

        const k = (keyword || '').toLowerCase();
        let list = (window.customersList || []).filter(c =>
            (c.name || '').toLowerCase().includes(k) ||
            (c.email || '').toLowerCase().includes(k) ||
            (c.phone || '').toLowerCase().includes(k)
        );

        list.sort((a, b) => pickCustSortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

        list.forEach(c => {
            const tierBadge = c.tier && c.tier !== '-'
                ? `<span class="inline-flex items-center"><span class="w-2 h-2 rounded-full bg-gray-300 mx-2"></span><span>${c.tier}</span></span>`
                : '';

            container.innerHTML += `
                <div onclick="chooseCustomerForManualPiutang('${c.id}')" class="p-4 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="flex items-center space-x-3.5 min-w-0 pr-3">
                        <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-sm flex-shrink-0">
                            ${c.avatarCode || '00'}
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

    window.chooseCustomerForManualPiutang = (custId) => {
        selectedCustForManualPiutang = (window.customersList || []).find(c => c.id === custId);
        window.closePilihPelangganPiutangView();
        updateSelectedCustomerForPiutangUI();
    };

    window.addCustomerFromContactPrompt = () => {
        const name = prompt("Masukkan nama pelanggan dari kontak HP:");
        if (!name || !name.trim()) return;
        const newCust = {
            id: 'cust_' + Date.now(),
            avatarCode: name.trim().substring(0, 2).toUpperCase(),
            name: name.trim(),
            code: '85',
            points: 0,
            tier: '-',
            phone: '812345678',
            address: '-',
            piutangList: []
        };
        window.customersList.unshift(newCust);
        window.chooseCustomerForManualPiutang(newCust.id);
    };

    window.addCustomerManualPrompt = () => {
        const name = prompt("Masukkan nama panggilan pelanggan baru:");
        if (!name || !name.trim()) return;
        const newCust = {
            id: 'cust_' + Date.now(),
            avatarCode: name.trim().substring(0, 2).toUpperCase(),
            name: name.trim(),
            code: '85',
            points: 0,
            tier: '-',
            phone: '812345678',
            address: '-',
            piutangList: []
        };
        window.customersList.unshift(newCust);
        window.chooseCustomerForManualPiutang(newCust.id);
    };

    window.saveManualPiutangBaru = () => {
        const nominal = Number(document.getElementById('input-manual-piutang-nominal').value) || 0;
        const dueRaw = document.getElementById('input-manual-piutang-due').value.trim(); // DD/MM/YYYY
        const notes = document.getElementById('input-manual-piutang-notes').value.trim();

        if (!selectedCustForManualPiutang) return alert("Pilih Pelanggan terlebih dahulu!");
        if (nominal <= 0) return alert("Masukkan nominal piutang lebih dari Rp 0!");

        const parts = dueRaw.split('/');
        const formattedDue = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : '2026/10/19';
        const nowStr = window.getFormattedCurrentDateTime().replace(/\//g, '-');
        const receiptNo = nowStr.replace(/[\-\:\s]/g, '');

        if (!Array.isArray(selectedCustForManualPiutang.piutangList)) {
            selectedCustForManualPiutang.piutangList = [];
        }

        selectedCustForManualPiutang.piutangList.push({
            id: 'piu_' + Date.now(),
            trxDate: nowStr,
            shortDate: "12/10/2026",
            dueDate: formattedDue,
            totalAmount: nominal,
            unpaidAmount: nominal,
            status: "Belum lunas",
            notes: notes,
            receiptNo: receiptNo,
            history: [
                {
                    id: 'h_' + Date.now(),
                    date: nowStr.split(' ')[0] + ' 00:00:00',
                    paid: 0,
                    remaining: nominal,
                    receiptNo: receiptNo,
                    by: 'Adm',
                    method: 'Cash',
                    notes: notes
                }
            ]
        });

        selectedCustForManualPiutang.debtCount = selectedCustForManualPiutang.piutangList.length;
        selectedCustForManualPiutang.debtTotal = selectedCustForManualPiutang.piutangList.reduce((s, x) => s + (Number(x.unpaidAmount) || 0), 0);

        alert("Data piutang baru berhasil disimpan!");
        window.closeTambahPiutangManualView();
    };

    // ========================================================================
    // 7. HALAMAN KREDIT/PIUTANG PER PELANGGAN (SS 1000922564 - 1000922569)
    // ========================================================================
    window.openCustomerKreditPiutangFromMain = (custId) => {
        const c = (window.customersList || []).find(x => x.id === custId);
        if (!c) return;
        activeKpCustomer = c;
        kpReturnView = 'view-piutang-main';
        openKreditPiutangScreen();
    };

    // Override fungsi openKreditPiutangView agar saat dibuka dari Profil Pelanggan juga memakai layar lengkap ini
    window.openKreditPiutangView = () => {
        const profName = document.getElementById('prof-cust-name')?.innerText;
        const found = (window.customersList || []).find(c => c.name === profName) || window.customersList[0];
        activeKpCustomer = found;
        kpReturnView = 'view-customer-profile';
        openKreditPiutangScreen();
    };

    function openKreditPiutangScreen() {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-kredit-piutang').classList.remove('hidden');
        document.getElementById('chk-kp-select-all').checked = false;
        window.renderCustomerPiutangTransactions();
    }

    window.closeKreditPiutangView = () => {
        document.getElementById('view-kredit-piutang').classList.add('hidden');
        document.getElementById(kpReturnView).classList.remove('hidden');
        if (kpReturnView === 'view-piutang-main') {
            window.renderPiutangMainList();
        }
    };

    window.toggleKpSortDropdown = () => {
        document.getElementById('dropdown-kp-sort').classList.toggle('hidden');
    };
    window.hideKpSortDropdown = () => {
        const el = document.getElementById('dropdown-kp-sort');
        if (el) el.classList.add('hidden');
    };
    window.applyKpTransactionSort = (mode) => {
        kpSortBy = mode;
        window.hideKpSortDropdown();
        window.renderCustomerPiutangTransactions();
    };

    window.renderCustomerPiutangTransactions = function() {
        if (!activeKpCustomer) return;
        const list = activeKpCustomer.piutangList || [];
        const statusFilter = document.getElementById('select-kp-status-filter')?.value || 'unpaid';

        let totalSisa = 0;
        let unpaidTrxCount = 0;
        list.forEach(item => {
            const rem = Number(item.unpaidAmount) || 0;
            if (rem > 0) {
                totalSisa += rem;
                unpaidTrxCount++;
            }
        });

        document.getElementById('kp-cust-name').innerText = activeKpCustomer.name;
        document.getElementById('kp-cust-debt-amount').innerText = `Rp ${totalSisa.toLocaleString('id-ID')}`;
        document.getElementById('kp-cust-debt-count').innerText = unpaidTrxCount;

        let filtered = list.filter(item => {
            const isUnpaid = (Number(item.unpaidAmount) || 0) > 0;
            return statusFilter === 'unpaid' ? isUnpaid : !isUnpaid;
        });

        filtered.sort((a, b) => {
            if (kpSortBy === 'due') return (a.dueDate || '').localeCompare(b.dueDate || '');
            return (b.trxDate || '').localeCompare(a.trxDate || '');
        });

        const container = document.getElementById('container-cust-piutang-rows');
        container.innerHTML = '';

        filtered.forEach(item => {
            const isUnpaid = (Number(item.unpaidAmount) || 0) > 0;
            const amountColor = item.unpaidAmount >= 1000000 ? 'text-red-700 font-bold' : 'text-gray-900 font-bold';

            container.innerHTML += `
                <div class="py-3.5 flex items-center justify-between text-xs">
                    <div class="flex items-center space-x-4 flex-1">
                        <input type="checkbox" name="chk_kp_trx_item" value="${item.id}" data-amount="${item.unpaidAmount}" onchange="updateKpCheckedBottomBar()" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer">
                        <div onclick="openDetailPiutangItemView('${item.id}')" class="space-y-0.5 flex-1 cursor-pointer">
                            <span class="text-emerald-600 font-bold block">${item.shortDate || '12/10/2026'}</span>
                            <span class="text-gray-900 font-semibold block">${isUnpaid ? 'Belum Dibayar' : 'Lunas'}</span>
                            <span class="text-gray-900 font-semibold block">Jatuh Tempo  ${item.dueDate}</span>
                        </div>
                    </div>
                    <div onclick="openDetailPiutangItemView('${item.id}')" class="text-right space-y-1 cursor-pointer">
                        <span class="inline-flex items-center text-gray-900 font-semibold">
                            <span class="w-2.5 h-2.5 rounded-full ${isUnpaid ? 'bg-red-700' : 'bg-emerald-600'} mr-1.5"></span>${isUnpaid ? 'Belum lunas' : 'Lunas'}
                        </span>
                        <p class="${amountColor}">Rp ${Number(item.unpaidAmount || item.totalAmount).toLocaleString('id-ID')}</p>
                    </div>
                </div>
            `;
        });

        window.updateKpCheckedBottomBar();
    };

    window.toggleSelectAllKpTransactions = (checked) => {
        document.querySelectorAll('input[name="chk_kp_trx_item"]').forEach(chk => {
            chk.checked = checked;
        });
        window.updateKpCheckedBottomBar();
    };

    window.updateKpCheckedBottomBar = () => {
        const checkedBoxes = document.querySelectorAll('input[name="chk_kp_trx_item"]:checked');
        const bottomBar = document.getElementById('bar-kp-checked-lunasi');
        const totalLbl = document.getElementById('label-kp-checked-total');

        if (checkedBoxes.length > 0) {
            let sum = 0;
            checkedBoxes.forEach(c => sum += Number(c.getAttribute('data-amount')) || 0);
            totalLbl.innerText = `Rp ${sum.toLocaleString('id-ID')}`;
            bottomBar.classList.remove('hidden');
        } else {
            bottomBar.classList.add('hidden');
        }
    };

    // --- POPUP FILTER TANGGAL & BUAT PIUTANG DI KREDIT/PIUTANG (SS 1000922566 & 1000922567) ---
    window.openFilterTanggalPiutangModal = () => {
        document.getElementById('modal-kp-filter-tanggal').classList.remove('hidden');
    };
    window.closeFilterTanggalPiutangModal = () => {
        document.getElementById('modal-kp-filter-tanggal').classList.add('hidden');
    };
    window.applyKpDateRangeQuickFilter = () => {
        window.closeFilterTanggalPiutangModal();
        window.renderCustomerPiutangTransactions();
    };

    window.openPopupBuatPiutangPelanggan = () => {
        document.getElementById('input-popup-kp-amount').value = '';
        document.getElementById('input-popup-kp-due').value = '19/10/2026';
        document.getElementById('input-popup-kp-notes').value = '';
        document.getElementById('chk-popup-kp-cashdrawer').checked = true;
        document.getElementById('modal-kp-tambah-piutang').classList.remove('hidden');
    };
    window.closePopupBuatPiutangPelanggan = () => {
        document.getElementById('modal-kp-tambah-piutang').classList.add('hidden');
    };
    window.savePopupBuatPiutangPelanggan = () => {
        const amount = Number(document.getElementById('input-popup-kp-amount').value) || 0;
        const dueRaw = document.getElementById('input-popup-kp-due').value.trim();
        const notes = document.getElementById('input-popup-kp-notes').value.trim();

        if (amount <= 0) return alert("Besar Piutang* wajib diisi lebih dari 0!");

        const parts = dueRaw.split('/');
        const formattedDue = parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : '2026/10/19';
        const nowStr = window.getFormattedCurrentDateTime().replace(/\//g, '-');
        const receiptNo = nowStr.replace(/[\-\:\s]/g, '');

        if (!Array.isArray(activeKpCustomer.piutangList)) activeKpCustomer.piutangList = [];
        activeKpCustomer.piutangList.push({
            id: 'piu_' + Date.now(),
            trxDate: nowStr,
            shortDate: "12/10/2026",
            dueDate: formattedDue,
            totalAmount: amount,
            unpaidAmount: amount,
            status: "Belum lunas",
            notes: notes,
            receiptNo: receiptNo,
            history: [
                { id: 'h_' + Date.now(), date: nowStr.split(' ')[0] + ' 00:00:00', paid: 0, remaining: amount, receiptNo: receiptNo, by: 'Adm', method: 'Cash', notes: notes }
            ]
        });

        window.closePopupBuatPiutangPelanggan();
        window.renderCustomerPiutangTransactions();
    };

    // ========================================================================
    // 8. HALAMAN BAGIKAN PENGINGAT (SS 1000922565)
    // ========================================================================
    window.openBagikanPengingatView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-bagikan-pengingat').classList.remove('hidden');

        const totalSisa = (activeKpCustomer?.piutangList || []).reduce((s, x) => s + (Number(x.unpaidAmount) || 0), 0);
        document.getElementById('card-reminder-cust-name').innerText = activeKpCustomer ? activeKpCustomer.name : 'MBG Ngroto';
        document.getElementById('card-reminder-amount').innerText = `Rp ${totalSisa.toLocaleString('id-ID')}`;
        document.getElementById('input-reminder-custom-title').value = 'Jangan Lupa Bayar';
        document.getElementById('card-reminder-title-text').innerText = 'Jangan Lupa Bayar';
    };

    window.closeBagikanPengingatView = () => {
        document.getElementById('view-bagikan-pengingat').classList.add('hidden');
        document.getElementById('view-kredit-piutang').classList.remove('hidden');
    };

    window.shareReminderAction = (channel) => {
        const custName = activeKpCustomer ? activeKpCustomer.name : 'Pelanggan';
        const totalSisa = (activeKpCustomer?.piutangList || []).reduce((s, x) => s + (Number(x.unpaidAmount) || 0), 0);
        const due = (activeKpCustomer?.piutangList && activeKpCustomer.piutangList[0]?.dueDate) || '2026/10/22';
        const customTitle = document.getElementById('input-reminder-custom-title').value || 'Jangan Lupa Bayar';
        const useTemplate = document.getElementById('chk-reminder-use-template').checked;

        const msg = useTemplate
            ? `Halo ${custName}, semoga harimu menyenangkan! 🙏\n\nKami dari REJEKI LANCAR ingin menginformasikan bahwa saat ini terdapat tagihan yang masih berjalan:\n\n📌 Total Tagihan: Rp ${totalSisa.toLocaleString('id-ID')}\n📅 Jatuh Tempo: ${due}\n\nMohon konfirmasi jika pembayaran sudah dilakukan ya. Terima kasih! 🙇‍♂️`
            : `${customTitle}\nTotal Tagihan: Rp ${totalSisa.toLocaleString('id-ID')}\nPelanggan: ${custName}\n- REJEKI LANCAR`;

        if (channel === 'wa') {
            window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
        } else if (channel === 'sms') {
            window.location.href = `sms:?body=${encodeURIComponent(msg)}`;
        } else {
            window.location.href = `mailto:?subject=${encodeURIComponent(customTitle)}&body=${encodeURIComponent(msg)}`;
        }
    };

    // ========================================================================
    // 9. HALAMAN DETAIL PIUTANG, COPY NOMOR STRUK, & EDIT RIWAYAT (SS 1000922570 & 1000922571)
    // ========================================================================
    window.openDetailPiutangItemView = (itemId) => {
        const item = (activeKpCustomer?.piutangList || []).find(x => x.id === itemId);
        if (!item) return;
        activePiutangItem = item;

        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-detail-piutang-item').classList.remove('hidden');

        renderDetailPiutangItemContent();
    };

    window.closeDetailPiutangItemView = () => {
        document.getElementById('view-detail-piutang-item').classList.add('hidden');
        document.getElementById('view-kredit-piutang').classList.remove('hidden');
        window.renderCustomerPiutangTransactions();
    };

    function renderDetailPiutangItemContent() {
        if (!activePiutangItem) return;
        const isUnpaid = (Number(activePiutangItem.unpaidAmount) || 0) > 0;

        document.getElementById('det-piutang-cust-name').innerText = activeKpCustomer ? activeKpCustomer.name : 'MBG Ngroto';
        document.getElementById('det-piutang-status-dot').className = `w-2.5 h-2.5 rounded-full ${isUnpaid ? 'bg-red-700' : 'bg-emerald-600'}`;
        document.getElementById('det-piutang-status-text').innerText = isUnpaid ? 'Belum lunas' : 'Lunas';
        document.getElementById('det-piutang-trx-date').innerText = activePiutangItem.trxDate || '2026-10-12 11:42:02';
        document.getElementById('det-piutang-due-date').innerText = activePiutangItem.dueDate || '2026/10/22';
        document.getElementById('det-piutang-total').innerText = `Rp ${Number(activePiutangItem.totalAmount || 0).toLocaleString('id-ID')}`;
        document.getElementById('det-piutang-unpaid').innerText = `Rp ${Number(activePiutangItem.unpaidAmount || 0).toLocaleString('id-ID')}`;

        const histContainer = document.getElementById('container-det-piutang-history');
        histContainer.innerHTML = '';

        (activePiutangItem.history || []).forEach((h, hIdx) => {
            histContainer.innerHTML += `
                <div class="border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                    <div class="bg-emerald-100/80 text-emerald-800 text-[11px] font-bold px-4 py-2 inline-block rounded-br-xl">
                        Tgl Pembayaran : ${h.date}
                    </div>
                    <div class="p-4 pt-3 space-y-2.5">
                        <div class="flex justify-between items-center">
                            <div class="grid grid-cols-3 gap-6 flex-1">
                                <div>
                                    <span class="text-gray-500 block">No.</span>
                                    <span class="font-bold text-gray-900 block mt-0.5">${hIdx + 1}.</span>
                                </div>
                                <div>
                                    <span class="text-gray-500 block">Cicilan</span>
                                    <span class="font-bold text-gray-900 block mt-0.5">Rp ${Number(h.paid || 0).toLocaleString('id-ID')}</span>
                                </div>
                                <div>
                                    <span class="text-gray-500 block">Belum dibayar</span>
                                    <span class="font-bold text-red-500 block mt-0.5">Rp ${Number(h.remaining || 0).toLocaleString('id-ID')}</span>
                                </div>
                            </div>
                            <button onclick="openEditRiwayatPiutangModal(${hIdx})" type="button" class="text-emerald-600 hover:text-emerald-800 text-lg p-1 ml-2" title="Edit Riwayat">
                                <i class="fa-solid fa-pen"></i>
                            </button>
                        </div>

                        <div class="flex items-center space-x-2.5 pt-1">
                            <span class="text-gray-500">No: <strong class="text-gray-900">${h.receiptNo || activePiutangItem.receiptNo}</strong></span>
                            <button onclick="copyReceiptNumber('${h.receiptNo || activePiutangItem.receiptNo}')" type="button" class="text-emerald-600 hover:text-emerald-800 text-base" title="Salin Nomor Struk">
                                <i class="fa-solid fa-clone"></i>
                            </button>
                        </div>
                        <p class="text-gray-500 font-semibold">Oleh : ${h.by || 'Adm'}</p>
                    </div>
                </div>
            `;
        });
    }

    window.copyReceiptNumber = (noStr) => {
        if (navigator.clipboard) navigator.clipboard.writeText(noStr);
        alert(`Nomor struk (${noStr}) berhasil disalin!`);
    };

    window.openStrukFromDetailPiutang = () => {
        if (window.openDigitalReceiptView) {
            window.openDigitalReceiptView(0);
        }
    };

    // Popup Edit Riwayat (SS 1000922571)
    window.openEditRiwayatPiutangModal = (hIdx) => {
        if (!activePiutangItem || !activePiutangItem.history[hIdx]) return;
        activeEditingHistoryIdx = hIdx;
        const h = activePiutangItem.history[hIdx];

        document.getElementById('edit-hist-piutang-date').value = h.date || '2026-10-12 00:00:00';
        document.getElementById('edit-hist-piutang-amount').value = Number(h.paid) || 0;
        document.getElementById('edit-hist-piutang-method').value = h.method || 'Cash';
        document.getElementById('edit-hist-piutang-notes').value = h.notes || '';
        document.getElementById('modal-edit-riwayat-piutang').classList.remove('hidden');
    };

    window.closeEditRiwayatPiutangModal = () => {
        document.getElementById('modal-edit-riwayat-piutang').classList.add('hidden');
    };

    window.saveEditRiwayatPiutangModal = () => {
        if (!activePiutangItem) return;
        const h = activePiutangItem.history[activeEditingHistoryIdx];
        const newPaid = Number(document.getElementById('edit-hist-piutang-amount').value) || 0;

        h.date = document.getElementById('edit-hist-piutang-date').value.trim();
        h.paid = newPaid;
        h.method = document.getElementById('edit-hist-piutang-method').value;
        h.notes = document.getElementById('edit-hist-piutang-notes').value.trim();

        // Hitung ulang sisa piutang transaksi ini
        const totalPaidSoFar = activePiutangItem.history.reduce((s, x) => s + (Number(x.paid) || 0), 0);
        const newRem = Math.max(0, Number(activePiutangItem.totalAmount) - totalPaidSoFar);
        h.remaining = newRem;
        activePiutangItem.unpaidAmount = newRem;
        activePiutangItem.status = newRem <= 0 ? 'Lunas' : 'Belum lunas';

        window.closeEditRiwayatPiutangModal();
        renderDetailPiutangItemContent();
    };

    // ========================================================================
    // 10. HALAMAN PEMBAYARAN PIUTANG (SS 1000922572)
    // ========================================================================
    window.openPembayaranPiutangView = (mode = 'single') => {
        paymentTargetMode = mode;
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pembayaran-piutang').classList.remove('hidden');

        if (mode === 'single' && activePiutangItem) {
            currentPayTargetAmount = Number(activePiutangItem.unpaidAmount) || 0;
        } else if (mode === 'checked') {
            let sum = 0;
            document.querySelectorAll('input[name="chk_kp_trx_item"]:checked').forEach(c => {
                sum += Number(c.getAttribute('data-amount')) || 0;
            });
            currentPayTargetAmount = sum;
        } else {
            currentPayTargetAmount = (activeKpCustomer?.piutangList || []).reduce((s, x) => s + (Number(x.unpaidAmount) || 0), 0);
        }

        document.getElementById('pay-piutang-cust-name').innerText = activeKpCustomer ? activeKpCustomer.name : 'MBG Ngroto';
        document.getElementById('pay-piutang-unpaid-disp').innerText = `Rp ${currentPayTargetAmount.toLocaleString('id-ID')}`;
        document.getElementById('input-pay-piutang-nominal').value = '0';
        document.getElementById('chk-pay-piutang-lunasi').checked = false;
        document.getElementById('input-pay-piutang-date').value = window.getFormattedCurrentDateTime().replace(/\//g, '-');
        document.getElementById('select-pay-piutang-method').value = 'Cash';
        document.getElementById('input-pay-piutang-notes').value = '';
        document.getElementById('chk-pay-piutang-cashdrawer').checked = true;
    };

    window.closePembayaranPiutangView = () => {
        document.getElementById('view-pembayaran-piutang').classList.add('hidden');
        if (paymentTargetMode === 'single') {
            document.getElementById('view-detail-piutang-item').classList.remove('hidden');
        } else {
            document.getElementById('view-kredit-piutang').classList.remove('hidden');
        }
    };

    window.toggleLunasiFullPiutang = (checked) => {
        document.getElementById('input-pay-piutang-nominal').value = checked ? currentPayTargetAmount : 0;
    };

    window.submitPembayaranPiutang = () => {
        const payNominal = Number(document.getElementById('input-pay-piutang-nominal').value) || 0;
        const payDate = document.getElementById('input-pay-piutang-date').value.trim();
        const payMethod = document.getElementById('select-pay-piutang-method').value;
        const payNotes = document.getElementById('input-pay-piutang-notes').value.trim();

        if (payNominal <= 0) return alert("Masukkan nominal pembayaran piutang lebih dari Rp 0!");

        if (paymentTargetMode === 'single' && activePiutangItem) {
            const newRem = Math.max(0, (Number(activePiutangItem.unpaidAmount) || 0) - payNominal);
            activePiutangItem.unpaidAmount = newRem;
            activePiutangItem.status = newRem <= 0 ? 'Lunas' : 'Belum lunas';
            activePiutangItem.history.push({
                id: 'h_' + Date.now(),
                date: payDate,
                paid: payNominal,
                remaining: newRem,
                receiptNo: payDate.replace(/[\-\:\s]/g, ''),
                by: 'Adm',
                method: payMethod,
                notes: payNotes
            });
            alert("Pembayaran piutang berhasil disimpan!");
            document.getElementById('view-pembayaran-piutang').classList.add('hidden');
            document.getElementById('view-detail-piutang-item').classList.remove('hidden');
            renderDetailPiutangItemContent();
        } else {
            // Pelunasan beberapa / seluruh transaksi piutang pelanggan
            let remainingPayment = payNominal;
            const checkedIds = Array.from(document.querySelectorAll('input[name="chk_kp_trx_item"]:checked')).map(c => c.value);

            (activeKpCustomer?.piutangList || []).forEach(item => {
                if (paymentTargetMode === 'checked' && !checkedIds.includes(item.id)) return;
                if (remainingPayment <= 0 || item.unpaidAmount <= 0) return;

                const deduct = Math.min(item.unpaidAmount, remainingPayment);
                remainingPayment -= deduct;
                item.unpaidAmount -= deduct;
                item.status = item.unpaidAmount <= 0 ? 'Lunas' : 'Belum lunas';
                item.history.push({
                    id: 'h_' + Date.now(),
                    date: payDate,
                    paid: deduct,
                    remaining: item.unpaidAmount,
                    receiptNo: payDate.replace(/[\-\:\s]/g, ''),
                    by: 'Adm',
                    method: payMethod,
                    notes: payNotes
                });
            });

            alert("Pembayaran piutang berhasil disimpan!");
            document.getElementById('view-pembayaran-piutang').classList.add('hidden');
            document.getElementById('view-kredit-piutang').classList.remove('hidden');
            window.renderCustomerPiutangTransactions();
        }
    };
})();
