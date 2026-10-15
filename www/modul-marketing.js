// ============================================================================
// MODUL 11: MARKETING (PROMOSI, LOYALTI POIN, KOMISI STAFF)
// (DESAIN KASIR PINTAR KLASIK & NATIVE DATES)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN MENU UTAMA MARKETING === -->
        <div id="view-marketing" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-20">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="switchView('manajemen-hub')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Marketing</h2>
            </div>

            <div class="divide-y divide-gray-100">
                <!-- Menu Promosi -->
                <div onclick="openPromosiMainView()" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl">
                        <i class="fa-solid fa-tags"></i>
                    </div>
                    <div>
                        <span class="font-bold text-sm text-gray-900 block">Promosi</span>
                        <span class="text-[11px] text-gray-500">Kelola promo diskon atau barang gratis untuk pelanggan</span>
                    </div>
                </div>

                <!-- Menu Loyalti Poin -->
                <div onclick="openLoyaltyPoinMainView()" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl">
                        <i class="fa-solid fa-star"></i>
                    </div>
                    <div>
                        <span class="font-bold text-sm text-gray-900 block">Loyalty Poin</span>
                        <span class="text-[11px] text-gray-500">Fitur yang membantu Anda mengelola poin pelanggan</span>
                    </div>
                </div>

                <!-- Menu Komisi Staff -->
                <div onclick="alert('Menu Komisi Staff Segera Hadir!')" class="p-4 bg-white flex items-center space-x-4 hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition relative overflow-hidden">
                    <div class="w-10 h-10 flex items-center justify-center text-emerald-600 text-2xl">
                        <i class="fa-solid fa-hand-holding-dollar"></i>
                    </div>
                    <div class="flex-1 pr-10">
                        <span class="font-bold text-sm text-gray-900 block">Komisi Staff</span>
                        <span class="text-[11px] text-gray-500">Beri persenan/uang tunai berdasarkan omzet staff</span>
                    </div>
                    <span class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-amber-400 text-white text-[10px] font-extrabold px-2.5 py-1 rounded">Baru!</span>
                </div>
            </div>
        </div>

        <!-- ============================================================== -->
        <!-- BAGIAN A: PROMOSI                                              -->
        <!-- ============================================================== -->

        <!-- === 2. HALAMAN DAFTAR PROMOSI === -->
        <div id="view-promosi-main" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-30">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="switchView('marketing')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Promosi</h2>
                </div>
                <button onclick="renderPromosiMainList()" class="text-emerald-700 text-xs font-bold px-2 py-1">Refresh</button>
            </div>

            <div class="p-3 bg-white border-b shadow-xs">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-search-promosi" oninput="renderPromosiMainList(this.value)" placeholder="Cari Promosi" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs font-medium text-gray-900 focus:outline-none">
                </div>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pb-24 bg-gray-50" id="container-promosi-rows"></div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openFormTambahPromosiHal2()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    TAMBAH PROMOSI
                </button>
            </div>
        </div>

        <!-- === 3. HALAMAN TAMBAH PROMOSI HAL 2/3 (SYARAT) === -->
        <div id="view-form-promosi-hal2" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeFormTambahPromosi()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Tambah Promosi</h2>
                </div>
                <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">Hal. 2/3</span>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-5 pb-28 bg-gray-50">
                <!-- Info Promosi Atas -->
                <div class="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                    <div>
                        <span class="block text-[11px] text-gray-500 font-semibold mb-1">Nama Promosi</span>
                        <input type="text" id="input-promo-name" placeholder="Misal: Promo Akhir Tahun" class="w-full border border-emerald-600 rounded-full text-sm font-bold text-gray-900 bg-white p-3 px-4 focus:outline-none">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="block text-[11px] text-gray-500 font-semibold mb-1">Kode Promosi</span>
                            <input type="text" id="input-promo-code" placeholder="KODE" class="w-full border border-gray-300 rounded-full text-xs font-bold text-gray-900 bg-white p-3 px-4 focus:outline-none focus:border-emerald-600">
                        </div>
                        <div>
                            <span class="block text-[11px] text-gray-500 font-semibold mb-1">Masa Berlaku</span>
                            <!-- NATIVE DATE -->
                            <input type="date" id="input-promo-period" class="w-full border border-gray-300 rounded-full text-xs font-bold text-gray-900 bg-white p-3 px-4 focus:outline-none focus:border-emerald-600">
                        </div>
                    </div>
                </div>

                <!-- Syarat Promosi -->
                <div class="bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-xs">
                    <h4 class="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Syarat Promosi</h4>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span class="font-bold text-xs text-gray-900">Pembelian Barang/Kategori</span>
                    </label>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="block text-[11px] font-semibold text-gray-500 mb-1">Beli (Jumlah)</span>
                            <input type="number" id="input-promo-beli-qty" value="1" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                        </div>
                        <div>
                            <span class="block text-[11px] font-semibold text-gray-500 mb-1">Tipe Target</span>
                            <div class="relative">
                                <select id="select-promo-tipe-beli" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 appearance-none bg-white focus:outline-none focus:border-emerald-600">
                                    <option value="Kategori">Kategori</option>
                                    <option value="Barang">Barang</option>
                                </select>
                                <i class="fa-solid fa-chevron-down text-gray-800 text-[10px] absolute right-4 top-4 pointer-events-none"></i>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span class="block text-[11px] font-semibold text-gray-500 mb-1" id="label-promo-target">Pilih Kategori</span>
                        <input type="text" id="input-promo-target-val" placeholder="Ketik kategori" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                    </div>
                </div>

                <!-- Tambah (Opsional) -->
                <div class="bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-xs">
                    <h4 class="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Ketentuan Tambahan</h4>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="checkbox" id="chk-promo-min-trx" checked class="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500">
                        <span class="font-bold text-xs text-gray-900">Minimal Transaksi (Rp)</span>
                    </label>

                    <input type="number" id="input-promo-min-trx" value="50000" class="w-full border border-emerald-600 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none">
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openFormTambahPromosiHal3()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    LANJUTKAN
                </button>
            </div>
        </div>

        <!-- === 4. HALAMAN TAMBAH PROMOSI HAL 3/3 (REWARD) === -->
        <div id="view-form-promosi-hal3" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="openFormTambahPromosiHal2()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Pilih Reward</h2>
                </div>
                <span class="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded">Hal. 3/3</span>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-5 pb-28 bg-gray-50">
                <!-- Info Promosi Terangkum -->
                <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4 space-y-2 shadow-xs">
                    <h4 class="font-extrabold text-sm text-emerald-900" id="disp-hal3-promo-name">Promo -</h4>
                    <p class="text-[10px] text-emerald-700 font-bold"><i class="fa-solid fa-barcode mr-1"></i> <span id="disp-hal3-promo-code">-</span></p>
                    <p class="text-[10px] text-emerald-700 font-bold"><i class="fa-regular fa-calendar mr-1"></i> <span id="disp-hal3-promo-period">-</span></p>
                    <div class="mt-2 pt-2 border-t border-emerald-200">
                        <span class="block text-[10px] text-emerald-800 font-bold mb-0.5">Syarat:</span>
                        <span class="text-xs font-semibold text-emerald-900" id="disp-hal3-promo-syarat">-</span>
                    </div>
                </div>

                <!-- Reward/Benefit -->
                <div class="bg-white border border-gray-200 rounded-xl p-4 space-y-4 shadow-xs">
                    <h4 class="font-extrabold text-sm text-gray-900 border-b border-gray-100 pb-2">Pilih Benefit</h4>
                    
                    <!-- Radio: Barang -->
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="promo_reward_type" value="barang" id="rad-promo-barang" onchange="togglePromoRewardMode()" class="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500">
                        <span class="font-bold text-xs text-gray-900">Gratis Barang</span>
                    </label>

                    <div id="box-promo-reward-barang" class="space-y-4 hidden pl-8">
                        <div>
                            <span class="block text-[11px] font-semibold text-gray-500 mb-1">Nama Barang Reward</span>
                            <input type="text" id="input-promo-reward-bname" placeholder="Pilih barang..." class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="block text-[11px] font-semibold text-gray-500 mb-1">Jumlah Gratis</span>
                                <input type="number" id="input-promo-reward-bqty" value="1" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                            </div>
                        </div>
                    </div>

                    <!-- Radio: Diskon -->
                    <label class="flex items-center space-x-3 cursor-pointer pt-2">
                        <input type="radio" name="promo_reward_type" value="diskon" id="rad-promo-diskon" onchange="togglePromoRewardMode()" class="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500" checked>
                        <span class="font-bold text-xs text-gray-900">Potongan Diskon</span>
                    </label>

                    <div id="box-promo-reward-diskon" class="space-y-3 pl-8">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="block text-[11px] font-semibold text-gray-500 mb-1">Tipe Potongan</span>
                                <div class="relative">
                                    <select id="select-promo-reward-dtype" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 appearance-none bg-white focus:outline-none focus:border-emerald-600">
                                        <option value="Rupiah">Rupiah (Rp)</option>
                                        <option value="Persen">Persen (%)</option>
                                    </select>
                                    <i class="fa-solid fa-chevron-down text-gray-800 text-[10px] absolute right-4 top-4 pointer-events-none"></i>
                                </div>
                            </div>
                            <div>
                                <span class="block text-[11px] font-semibold text-gray-500 mb-1">Nilai Diskon</span>
                                <input type="number" id="input-promo-reward-dval" value="5000" class="w-full border border-emerald-600 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none">
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Ketentuan Lain -->
                <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
                    <div onclick="togglePromoKetentuanLain()" class="flex justify-between items-center cursor-pointer">
                        <h4 class="font-extrabold text-sm text-gray-900">Atur Hari Berlaku</h4>
                        <i id="icon-promo-ketentuan" class="fa-solid fa-chevron-down text-gray-500"></i>
                    </div>

                    <div id="box-promo-ketentuan" class="space-y-4 pt-4 mt-4 border-t border-gray-100 hidden">
                        <div class="grid grid-cols-2 gap-4 text-xs font-bold text-gray-700">
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Senin</span></label>
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Selasa</span></label>
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Rabu</span></label>
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Kamis</span></label>
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Jumat</span></label>
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Sabtu</span></label>
                            <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-gray-300"><span>Minggu</span></label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="savePromosiBaru()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN PROMO
                </button>
            </div>
        </div>

        <!-- === 5. HALAMAN DETAIL PROMOSI === -->
        <div id="view-detail-promosi" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeDetailPromosi()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Detail Promosi</h2>
                </div>
                <button onclick="alert('Promo dinonaktifkan.')" class="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-full hover:bg-red-100 transition">Nonaktifkan</button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <div class="bg-white border border-gray-200 rounded-xl p-5 space-y-3 shadow-xs">
                    <div>
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Nama Promosi</span>
                        <span class="text-sm font-extrabold text-gray-900" id="det-promo-name">Promo Akhir Tahun</span>
                    </div>
                    <div>
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Kode Promosi</span>
                        <span class="text-xs font-extrabold text-emerald-600" id="det-promo-code">20261013122420</span>
                    </div>
                    <div>
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Berlaku Hingga</span>
                        <span class="text-xs font-bold text-gray-900" id="det-promo-period">31 Des 2026</span>
                    </div>
                </div>

                <div class="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-xs">
                    <div>
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Syarat Mendapatkan</span>
                        <span class="text-xs font-bold text-gray-900 leading-relaxed" id="det-promo-syarat">Beli 1 produk kategori "tisu" dengan MINIMAL transaksi Rp 50.000</span>
                    </div>
                    <div class="pt-3 border-t border-gray-100">
                        <span class="block text-[11px] text-emerald-600 font-bold mb-0.5">Reward / Benefit</span>
                        <span class="text-sm font-extrabold text-gray-900" id="det-promo-reward">Diskon Rp 5.000</span>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="closeDetailPromosi()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    KEMBALI
                </button>
            </div>
        </div>

        <!-- ============================================================== -->
        <!-- BAGIAN B: LOYALTI POIN                                         -->
        <!-- ============================================================== -->

        <!-- === 6. HALAMAN MENU UTAMA LOYALTI POIN === -->
        <div id="view-loyalti-main" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-30">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="switchView('marketing')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Loyalty Poin</h2>
            </div>

            <div class="flex-1 overflow-y-auto bg-gray-50 space-y-3 pb-24">
                <div class="bg-white p-5 shadow-xs border-b border-gray-100">
                    <p class="text-xs text-gray-500 font-semibold mb-3 leading-relaxed">Fitur yang membantu Anda mengelola poin pelanggan secara otomatis melalui transaksi.</p>
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="text-xs font-extrabold text-gray-900">Set Poin Awal</span>
                    </div>
                    <div class="flex border border-emerald-600 rounded-full overflow-hidden shadow-sm">
                        <input type="number" id="input-loyalty-set-poin" value="0" class="flex-1 p-3 px-4 text-sm font-bold text-gray-900 focus:outline-none">
                        <button onclick="alert('Poin awal berhasil diatur! Semua pelanggan baru akan otomatis mendapatkan poin ini.')" class="bg-emerald-600 text-white text-xs font-bold px-6 hover:bg-emerald-700 transition tracking-wider uppercase">Atur</button>
                    </div>
                </div>

                <div class="bg-white p-5 shadow-xs border-y border-gray-100 space-y-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm"><i class="fa-solid fa-hand-holding-hand"></i></div>
                        <span class="font-extrabold text-sm text-gray-900">Tukar Poin</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="openTukarPoinDiskonView()" class="border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-3.5 rounded-xl text-xs shadow-sm transition">Jadi Diskon</button>
                        <button onclick="openTukarPoinBarangView()" class="border border-emerald-600 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-3.5 rounded-xl text-xs shadow-sm transition">Jadi Barang</button>
                    </div>
                </div>

                <div class="bg-white p-5 shadow-xs border-y border-gray-100 space-y-4">
                    <div class="flex items-center space-x-2">
                        <div class="w-8 h-8 rounded-full bg-amber-100 text-amber-500 flex items-center justify-center text-sm"><i class="fa-solid fa-star"></i></div>
                        <span class="font-extrabold text-sm text-gray-900">Dapatkan Poin</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="openDapatPoinTransaksiView()" class="border border-amber-500 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold py-3.5 rounded-xl text-xs shadow-sm transition">Dari Transaksi</button>
                        <button onclick="openDapatPoinBarangView()" class="border border-amber-500 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold py-3.5 rounded-xl text-xs shadow-sm transition">Dari Barang</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- === 7. HALAMAN TUKAR POIN JADI DISKON === -->
        <div id="view-tukar-poin-diskon" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="closeTukarPoinDiskonView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Tukar Poin Jadi Diskon</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-3 pb-28 bg-gray-50">
                <!-- Kartu Aturan Diskon -->
                <div class="border border-emerald-200 rounded-xl bg-white p-4 shadow-sm space-y-3 hover:border-emerald-500 transition">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="text-[11px] text-gray-500 font-semibold block mb-0.5">Tukar 100 Poin Jadi Diskon</span>
                            <span class="text-base font-extrabold text-emerald-600">10%</span>
                        </div>
                        <div class="flex space-x-3 text-lg">
                            <button class="text-red-400 hover:text-red-600"><i class="fa-regular fa-trash-can"></i></button>
                            <button class="text-emerald-500 hover:text-emerald-700"><i class="fa-solid fa-pen"></i></button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="alert('Buka Form Input Set Poin Jadi Diskon')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    TAMBAH ATURAN
                </button>
            </div>
        </div>

        <!-- === 8. HALAMAN TUKAR POIN JADI BARANG === -->
        <div id="view-tukar-poin-barang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="closeTukarPoinBarangView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Tukar Poin Jadi Barang</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-3 pb-28 bg-gray-50">
                <div class="border border-gray-200 rounded-xl bg-white p-4 shadow-sm flex justify-between items-center">
                    <div>
                        <h4 class="font-extrabold text-sm text-gray-900">Jaket Eksklusif</h4>
                        <p class="text-[11px] text-gray-500 font-semibold mt-0.5">jaket-01</p>
                        <p class="text-amber-500 font-bold text-xs mt-1.5 flex items-center"><i class="fa-solid fa-star mr-1"></i>1000 Poin</p>
                    </div>
                    <div class="flex space-x-4 text-lg">
                        <button class="text-red-400 hover:text-red-600"><i class="fa-solid fa-arrow-rotate-left"></i></button>
                        <button class="text-emerald-500 hover:text-emerald-700"><i class="fa-solid fa-pen"></i></button>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="alert('Pilih Barang dari Katalog')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    PILIH BARANG REWARD
                </button>
            </div>
        </div>

        <!-- === 9. HALAMAN DAPAT POIN DARI TRANSAKSI === -->
        <div id="view-dapat-poin-trx" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeDapatPoinTransaksiView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Poin dari Transaksi</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                <div class="bg-white border border-emerald-200 rounded-xl p-5 shadow-sm">
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <p class="text-[11px] text-gray-500 font-semibold mb-1">Setiap Transaksi Kelipatan Rp 50.000 Mendapatkan</p>
                            <p class="font-extrabold text-base text-emerald-600">5 Poin</p>
                        </div>
                        <button class="text-emerald-600 hover:text-emerald-800 text-xl"><i class="fa-solid fa-pen"></i></button>
                    </div>
                    
                    <div class="flex justify-between items-center pt-3 border-t border-gray-100">
                        <span class="text-xs font-bold text-gray-800">Status Aturan</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked class="sr-only peer">
                            <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- === 10. HALAMAN DAPAT POIN DARI BARANG === -->
        <div id="view-dapat-poin-barang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeDapatPoinBarangView()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Poin Khusus Barang</h2>
            </div>

            <div class="p-4 space-y-4 z-20 relative bg-white pb-6 shadow-xs border-b border-gray-100">
                <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1.5">Set Poin yang Didapat</label>
                    <input type="number" value="10" class="w-full border border-gray-300 rounded-full p-3 px-4 text-sm font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <button class="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-full text-xs shadow-md transition uppercase tracking-wider">
                    TERAPKAN KE BARANG
                </button>
            </div>
            
            <div class="px-4 pt-4 pb-2 bg-gray-50 border-b border-gray-200">
                <span class="text-xs font-bold text-gray-800">Daftar Barang dengan Poin Khusus</span>
            </div>
            
            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 bg-white">
                <div class="p-4 flex justify-between items-center hover:bg-gray-50 transition">
                    <div>
                        <h4 class="font-bold text-sm text-gray-900">Kopi Susu Spesial</h4>
                        <p class="text-[11px] text-gray-500 font-semibold mt-0.5">kopi-01</p>
                    </div>
                    <div class="text-right">
                        <span class="text-amber-500 font-extrabold text-sm block">+10 Poin</span>
                        <button class="text-red-500 text-xs font-bold mt-1 hover:underline">Hapus Aturan</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Pasang ke DOM
    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);


    // ========================================================================
    // 3. LOGIKA JAVASCRIPT MARKETING
    // ========================================================================

    // PROMOSI
    window.openPromosiMainView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-promosi-main').classList.remove('hidden');
        document.getElementById('input-search-promosi').value = '';
        window.renderPromosiMainList('');
    };

    window.renderPromosiMainList = function(keyword = '') {
        const container = document.getElementById('container-promosi-rows');
        if (!container) return;
        container.innerHTML = '';
        const samplePromotions = [{ name: "Promo Akhir Tahun", active: true }, { name: "Gratis Ongkir", active: false }];
        
        samplePromotions.forEach(p => {
            const statusBadge = p.active 
                ? '<span class="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">Aktif</span>' 
                : '<span class="bg-gray-200 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">Tidak Aktif</span>';
            container.innerHTML += `
                <div onclick="openFormTambahPromosiHal2()" class="p-4 bg-white flex justify-between items-center hover:bg-emerald-50 cursor-pointer transition">
                    <div>
                        <span class="font-extrabold text-sm text-gray-900 block mb-1">${p.name}</span>
                        ${statusBadge}
                    </div>
                    <i class="fa-solid fa-chevron-right text-gray-400 text-sm"></i>
                </div>
            `;
        });
    };

    window.openFormTambahPromosiHal2 = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-form-promosi-hal2').classList.remove('hidden');
    };
    window.closeFormTambahPromosi = () => {
        document.getElementById('view-form-promosi-hal2').classList.add('hidden');
        document.getElementById('view-promosi-main').classList.remove('hidden');
    };
    window.openFormTambahPromosiHal3 = () => {
        const pName = document.getElementById('input-promo-name').value || '-';
        const pCode = document.getElementById('input-promo-code').value || '-';
        const pPeriod = document.getElementById('input-promo-period').value || '-';
        
        document.getElementById('disp-hal3-promo-name').innerText = pName;
        document.getElementById('disp-hal3-promo-code').innerText = pCode;
        document.getElementById('disp-hal3-promo-period').innerText = pPeriod;
        
        document.getElementById('view-form-promosi-hal2').classList.add('hidden');
        document.getElementById('view-form-promosi-hal3').classList.remove('hidden');
    };
    window.togglePromoRewardMode = () => {
        const isBarang = document.getElementById('rad-promo-barang').checked;
        if (isBarang) {
            document.getElementById('box-promo-reward-barang').classList.remove('hidden');
            document.getElementById('box-promo-reward-diskon').classList.add('hidden');
        } else {
            document.getElementById('box-promo-reward-barang').classList.add('hidden');
            document.getElementById('box-promo-reward-diskon').classList.remove('hidden');
        }
    };
    window.togglePromoKetentuanLain = () => {
        const box = document.getElementById('box-promo-ketentuan');
        box.classList.toggle('hidden');
    };
    window.savePromosiBaru = () => {
        alert("Promosi baru berhasil disimpan!");
        document.getElementById('view-form-promosi-hal3').classList.add('hidden');
        document.getElementById('view-promosi-main').classList.remove('hidden');
    };

    // LOYALTI POIN
    window.openLoyaltyPoinMainView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-loyalti-main').classList.remove('hidden');
    };

    window.openTukarPoinDiskonView = () => {
        document.getElementById('view-loyalti-main').classList.add('hidden');
        document.getElementById('view-tukar-poin-diskon').classList.remove('hidden');
    };
    window.closeTukarPoinDiskonView = () => {
        document.getElementById('view-tukar-poin-diskon').classList.add('hidden');
        document.getElementById('view-loyalti-main').classList.remove('hidden');
    };

    window.openTukarPoinBarangView = () => {
        document.getElementById('view-loyalti-main').classList.add('hidden');
        document.getElementById('view-tukar-poin-barang').classList.remove('hidden');
    };
    window.closeTukarPoinBarangView = () => {
        document.getElementById('view-tukar-poin-barang').classList.add('hidden');
        document.getElementById('view-loyalti-main').classList.remove('hidden');
    };

    window.openDapatPoinTransaksiView = () => {
        document.getElementById('view-loyalti-main').classList.add('hidden');
        document.getElementById('view-dapat-poin-trx').classList.remove('hidden');
    };
    window.closeDapatPoinTransaksiView = () => {
        document.getElementById('view-dapat-poin-trx').classList.add('hidden');
        document.getElementById('view-loyalti-main').classList.remove('hidden');
    };

    window.openDapatPoinBarangView = () => {
        document.getElementById('view-loyalti-main').classList.add('hidden');
        document.getElementById('view-dapat-poin-barang').classList.remove('hidden');
    };
    window.closeDapatPoinBarangView = () => {
        document.getElementById('view-dapat-poin-barang').classList.add('hidden');
        document.getElementById('view-loyalti-main').classList.remove('hidden');
    };

})();
