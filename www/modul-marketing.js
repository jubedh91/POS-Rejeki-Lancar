// ============================================================================
// MODUL 11: MARKETING (PROMOSI & LOYALTI POIN LENGKAP - 18 SS)
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN MENU UTAMA MARKETING === -->
        <div id="view-marketing" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
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
            </div>
        </div>

        <!-- ============================================================== -->
        <!-- BAGIAN A: PROMOSI (SS 1000924598 - 1000924606)                 -->
        <!-- ============================================================== -->

        <!-- === 2. HALAMAN DAFTAR PROMOSI (SS 1000924603) === -->
        <div id="view-promosi-main" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="switchView('marketing')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Promosi</h2>
                </div>
                <button onclick="renderPromosiMainList()" class="text-emerald-700 text-xs font-bold px-2 py-1">Refresh</button>
            </div>

            <div class="p-3 bg-white border-b">
                <div class="relative">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><i class="fa-solid fa-search text-base"></i></span>
                    <input type="text" id="input-search-promosi" oninput="renderPromosiMainList(this.value)" placeholder="Cari Promosi" class="w-full pl-9 pr-4 py-2.5 border border-emerald-600 rounded-lg text-xs font-medium text-gray-900 focus:outline-none">
                </div>
            </div>

            <div class="flex-1 overflow-y-auto divide-y divide-gray-100 pb-24" id="container-promosi-rows"></div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openFormTambahPromosiHal2()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    TAMBAH PROMOSI
                </button>
            </div>
        </div>

        <!-- === 3. HALAMAN TAMBAH PROMOSI HAL 2/3 (SYARAT) (SS 1000924598) === -->
        <div id="view-form-promosi-hal2" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeFormTambahPromosi()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Tambah Promosi</h2>
                </div>
                <span class="text-xs font-semibold text-gray-600">Hal. 2/3</span>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-5 pb-28">
                <!-- Info Promosi Atas -->
                <div class="grid grid-cols-2 gap-4 pb-2 border-b border-gray-100">
                    <div class="col-span-2">
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Nama Promosi</span>
                        <input type="text" id="input-promo-name" value="promo duarr" class="w-full text-sm font-bold text-gray-900 bg-transparent focus:outline-none focus:border-b focus:border-emerald-600">
                    </div>
                    <div>
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Kode Promosi</span>
                        <input type="text" id="input-promo-code" value="20261013122420" class="w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none focus:border-b focus:border-emerald-600">
                    </div>
                    <div>
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Periode</span>
                        <input type="text" id="input-promo-period" value="2026-10-13 s/d 2026-10-31" class="w-full text-xs font-bold text-gray-900 bg-transparent focus:outline-none focus:border-b focus:border-emerald-600 text-right">
                    </div>
                </div>

                <!-- Syarat Promosi -->
                <div class="space-y-4">
                    <h4 class="font-bold text-sm text-gray-600">Syarat Promosi</h4>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <div class="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-white text-xs"><i class="fa-solid fa-check"></i></div>
                        <span class="font-bold text-xs text-gray-900">Pembelian Barang/Kategori</span>
                    </label>

                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <span class="block text-xs font-semibold text-gray-500 mb-1">Beli (Jumlah)</span>
                            <input type="number" id="input-promo-beli-qty" value="1" class="w-full border border-gray-300 rounded-lg p-2.5 px-3.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                        </div>
                        <div>
                            <span class="block text-xs font-semibold text-gray-500 mb-1">Tipe</span>
                            <div class="relative">
                                <select id="select-promo-tipe-beli" class="w-full border border-gray-300 rounded-lg p-2.5 px-3.5 text-xs font-bold text-gray-900 appearance-none bg-white focus:outline-none focus:border-emerald-600">
                                    <option value="Kategori">Kategori</option>
                                    <option value="Barang">Barang</option>
                                </select>
                                <i class="fa-solid fa-chevron-down text-gray-800 text-xs absolute right-3 top-3 pointer-events-none"></i>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span class="block text-xs font-semibold text-gray-500 mb-1" id="label-promo-target">Kategori</span>
                        <input type="text" id="input-promo-target-val" value="tisu" class="w-full border border-gray-300 rounded-lg p-2.5 px-3.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                    </div>
                </div>

                <!-- Tambah (Opsional) -->
                <div class="space-y-4 pt-4 border-t border-gray-100">
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-semibold text-gray-500">Tambah (Opsional)</span>
                        <span class="border border-gray-300 rounded-md px-2 py-1 text-[11px] font-bold text-gray-700">Status</span>
                    </div>

                    <label class="flex items-center space-x-3 cursor-pointer">
                        <div class="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-white text-xs"><i class="fa-solid fa-check"></i></div>
                        <span class="font-bold text-xs text-gray-900">Minimal Transaksi (Rp)</span>
                    </label>

                    <input type="number" id="input-promo-min-trx" value="500000" class="w-full border border-emerald-600 rounded-lg p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none">
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openFormTambahPromosiHal3()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    LANJUT
                </button>
            </div>
        </div>

        <!-- === 4. HALAMAN TAMBAH PROMOSI HAL 3/3 (REWARD) (SS 1000924599 - 1000924602) === -->
        <div id="view-form-promosi-hal3" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="openFormTambahPromosiHal2()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Tambah Promosi</h2>
                </div>
                <span class="text-xs font-semibold text-gray-600">Hal. 3/3</span>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-5 pb-28">
                <!-- Info Promosi Terangkum -->
                <div class="grid grid-cols-2 gap-4 pb-4 border-b border-gray-100">
                    <div class="col-span-2">
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Nama Promosi</span>
                        <span class="text-sm font-bold text-gray-900" id="disp-hal3-promo-name">promo duarr</span>
                    </div>
                    <div>
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Kode Promosi</span>
                        <span class="text-xs font-bold text-gray-900" id="disp-hal3-promo-code">20261013122420</span>
                    </div>
                    <div>
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Periode</span>
                        <span class="text-xs font-bold text-gray-900" id="disp-hal3-promo-period">2026-10-13 s/d 2026-10-31</span>
                    </div>
                    <div class="col-span-2">
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Syarat Promosi</span>
                        <span class="text-xs font-bold text-gray-900" id="disp-hal3-promo-syarat">Beli 1 tisu disertai dengan MINIMAL transaksi Rp 500.000</span>
                    </div>
                </div>

                <!-- Reward/Benefit -->
                <div class="space-y-4">
                    <h4 class="font-bold text-sm text-gray-600">Reward/Benefit</h4>
                    
                    <!-- Radio: Barang -->
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="promo_reward_type" value="barang" id="rad-promo-barang" onchange="togglePromoRewardMode()" class="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500">
                        <span class="font-bold text-xs text-gray-900">Barang</span>
                    </label>

                    <div id="box-promo-reward-barang" class="space-y-4 hidden pl-8">
                        <div>
                            <span class="block text-[11px] font-semibold text-gray-500 mb-1">Nama Barang Reward</span>
                            <input type="text" id="input-promo-reward-bname" placeholder="Nama Barang Reward" class="w-full border border-gray-300 rounded-lg p-2.5 px-3.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                        </div>
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="block text-[11px] font-semibold text-gray-500 mb-1">Jumlah</span>
                                <input type="number" id="input-promo-reward-bqty" value="0" class="w-full border border-gray-300 rounded-lg p-2.5 px-3.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                            </div>
                            <div>
                                <span class="block text-[11px] font-semibold text-gray-500 mb-1">Harga</span>
                                <input type="number" id="input-promo-reward-bprice" placeholder="Harga" class="w-full border border-gray-300 rounded-lg p-2.5 px-3.5 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                            </div>
                        </div>
                    </div>

                    <!-- Radio: Diskon -->
                    <label class="flex items-center space-x-3 cursor-pointer pt-2">
                        <input type="radio" name="promo_reward_type" value="diskon" id="rad-promo-diskon" onchange="togglePromoRewardMode()" class="w-5 h-5 text-emerald-600 border-gray-300 focus:ring-emerald-500" checked>
                        <span class="font-bold text-xs text-gray-900">Diskon</span>
                    </label>

                    <div id="box-promo-reward-diskon" class="space-y-2 pl-8">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <span class="block text-[11px] font-semibold text-gray-500 mb-1">Tipe</span>
                                <div class="relative">
                                    <select id="select-promo-reward-dtype" class="w-full border border-gray-300 rounded-lg p-2.5 px-3.5 text-xs font-bold text-gray-900 appearance-none bg-white focus:outline-none focus:border-emerald-600">
                                        <option value="Rupiah">Rupiah</option>
                                        <option value="Persen">Persen</option>
                                    </select>
                                    <i class="fa-solid fa-chevron-down text-gray-800 text-[10px] absolute right-3 top-3 pointer-events-none"></i>
                                </div>
                            </div>
                            <div>
                                <span class="block text-[11px] font-semibold text-gray-500 mb-1">Diskon</span>
                                <input type="number" id="input-promo-reward-dval" value="5000" class="w-full border border-emerald-600 rounded-lg p-2.5 px-3.5 text-xs font-bold text-gray-900 focus:outline-none">
                            </div>
                        </div>
                        <p class="text-[9px] text-gray-500">*Diskon per Barang akan ditimpa oleh Diskon Promosi jika Ada</p>
                    </div>
                </div>

                <!-- Ketentuan Lain -->
                <div class="pt-4 border-t border-gray-100">
                    <div onclick="togglePromoKetentuanLain()" class="flex justify-center items-center space-x-2 cursor-pointer text-[11px] font-semibold text-gray-600 mb-4">
                        <span>Ketentuan Lain</span>
                        <i id="icon-promo-ketentuan" class="fa-solid fa-chevron-up"></i>
                    </div>

                    <div id="box-promo-ketentuan" class="space-y-4">
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <div class="w-5 h-5 rounded bg-emerald-600 flex items-center justify-center text-white text-xs"><i class="fa-solid fa-check"></i></div>
                            <span class="font-bold text-xs text-gray-900">Berlaku di Hari</span>
                        </label>
                        
                        <div class="grid grid-cols-2 gap-4 pl-8 text-xs font-bold text-gray-700">
                            <label class="flex items-center space-x-3 cursor-pointer">
                                <div class="w-4 h-4 rounded bg-emerald-600 flex items-center justify-center text-white text-[10px]"><i class="fa-solid fa-check"></i></div><span>senin</span>
                            </label>
                            <label class="flex items-center space-x-3 cursor-pointer">
                                <div class="w-4 h-4 rounded border border-gray-400"></div><span>selasa</span>
                            </label>
                            <label class="flex items-center space-x-3 cursor-pointer">
                                <div class="w-4 h-4 rounded border border-gray-400"></div><span>rabu</span>
                            </label>
                            <label class="flex items-center space-x-3 cursor-pointer">
                                <div class="w-4 h-4 rounded bg-emerald-600 flex items-center justify-center text-white text-[10px]"><i class="fa-solid fa-check"></i></div><span>kamis</span>
                            </label>
                            <label class="flex items-center space-x-3 cursor-pointer">
                                <div class="w-4 h-4 rounded border border-gray-400"></div><span>jumat</span>
                            </label>
                            <label class="flex items-center space-x-3 cursor-pointer">
                                <div class="w-4 h-4 rounded border border-gray-400"></div><span>sabtu</span>
                            </label>
                            <label class="flex items-center space-x-3 cursor-pointer">
                                <div class="w-4 h-4 rounded border border-gray-400"></div><span>minggu</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="savePromosiBaru()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === 5. HALAMAN DETAIL PROMOSI (SS 1000924604 - 1000924606) === -->
        <div id="view-detail-promosi" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="closeDetailPromosi()" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-emerald-700">Detail Promosi</h2>
                </div>
                <button onclick="document.getElementById('modal-promo-nonaktifkan').classList.remove('hidden')" class="text-xs font-semibold text-red-700 px-2 py-1">Nonaktifkan</button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                    <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Nama Promosi</span>
                    <span class="text-sm font-extrabold text-gray-900" id="det-promo-name">promo duarr</span>
                </div>
                <div>
                    <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Kode Promosi</span>
                    <span class="text-sm font-extrabold text-gray-900" id="det-promo-code">20261013122420</span>
                </div>
                <div>
                    <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Periode</span>
                    <span class="text-sm font-extrabold text-gray-900" id="det-promo-period">2026-10-13 s/d 2026-10-31</span>
                </div>
                <div>
                    <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Syarat Promosi</span>
                    <span class="text-sm font-extrabold text-gray-900" id="det-promo-syarat">Beli 1 tisu disertai dengan MINIMAL transaksi Rp 500.000</span>
                </div>
                <div>
                    <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Reward/Benefit</span>
                    <span class="text-sm font-extrabold text-gray-900" id="det-promo-reward">Diskon Rp 5.000</span>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="editPromosiSaved()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    EDIT
                </button>
            </div>
        </div>

        <!-- ============================================================== -->
        <!-- BAGIAN B: LOYALTI POIN (SS 1000924624 - 1000924773)            -->
        <!-- ============================================================== -->

        <!-- === 6. HALAMAN MENU UTAMA LOYALTI POIN (SS 1000924624) === -->
        <div id="view-loyalti-main" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="switchView('marketing')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Loyalty Poin</h2>
            </div>

            <div class="flex-1 overflow-y-auto bg-slate-50/50 space-y-2 pb-24">
                <div class="bg-white p-4 pb-6 shadow-xs border-b border-gray-100">
                    <p class="text-xs text-gray-600 font-medium mb-3">Fitur yang membantu Anda mengelola poin pelanggan melalui transaksi</p>
                    <div class="flex items-center space-x-2 mb-1.5">
                        <span class="text-xs font-semibold text-gray-600">Set Poin Awal</span>
                        <button onclick="document.getElementById('modal-loyalty-info').classList.remove('hidden')" class="w-4 h-4 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[10px] font-bold">?</button>
                    </div>
                    <div class="flex border border-gray-300 rounded-lg overflow-hidden">
                        <input type="number" id="input-loyalty-set-poin" value="0" class="flex-1 p-3 px-4 text-xs font-semibold text-gray-900 focus:outline-none">
                        <button onclick="alert('Poin awal berhasil diatur!')" class="bg-emerald-600 text-white text-xs font-bold px-6 hover:bg-emerald-700 transition">Atur</button>
                    </div>
                </div>

                <div class="bg-white p-4 shadow-xs border-y border-gray-100 space-y-3">
                    <div class="flex items-center space-x-2">
                        <i class="fa-solid fa-star text-gray-600 text-lg"></i>
                        <span class="font-bold text-xs text-gray-900">Tukar Poin</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="openTukarPoinDiskonView()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full text-xs shadow-sm transition">Menjadi Diskon</button>
                        <button onclick="openTukarPoinBarangView()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full text-xs shadow-sm transition">Menjadi Barang</button>
                    </div>
                </div>

                <div class="bg-white p-4 shadow-xs border-y border-gray-100 space-y-3">
                    <div class="flex items-center space-x-2">
                        <i class="fa-solid fa-star text-gray-600 text-lg"></i>
                        <span class="font-bold text-xs text-gray-900">Dapatkan Poin</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <button onclick="openDapatPoinTransaksiView()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full text-xs shadow-sm transition">Dari Transaksi</button>
                        <button onclick="openDapatPoinBarangView()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full text-xs shadow-sm transition">Dari Barang</button>
                    </div>
                </div>
            </div>
        </div>

        <!-- === 7. HALAMAN TUKAR POIN JADI DISKON (SS 1000924626 - 1000924628) === -->
        <div id="view-tukar-poin-diskon" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="closeTukarPoinDiskonView()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Tukar Poin Jadi Diskon</h2>
            </div>

            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20">
                <div class="relative">
                    <button onclick="toggleFilterTukarDiskon()" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-filter-tukar-diskon" class="absolute left-0 top-10 w-48 bg-white rounded-md shadow-2xl border border-gray-200 py-1 hidden z-50 text-xs font-medium text-gray-900">
                        <button onclick="alert('Filter by Poin'); toggleFilterTukarDiskon();" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Poin</button>
                        <button onclick="alert('Filter by Diskon'); toggleFilterTukarDiskon();" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Diskon</button>
                    </div>
                </div>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-700"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-search-tukar-diskon" placeholder="Cari poin atau diskon" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-3 pb-28">
                <!-- Kartu 1 -->
                <div class="border border-gray-200 rounded-xl bg-white p-3 shadow-xs space-y-2">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="text-xs text-gray-500 font-semibold block mb-0.5">Tukar 100 Poin Jadi Diskon</span>
                            <span class="text-sm font-extrabold text-gray-900">10%</span>
                        </div>
                        <div class="flex space-x-3 text-lg">
                            <button class="text-red-500 hover:text-red-700"><i class="fa-regular fa-trash-can"></i></button>
                            <button class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-2">
                        <span class="text-xs font-bold text-emerald-600">Aktif</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked class="sr-only peer">
                            <div class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>
                </div>

                <!-- Kartu 2 -->
                <div class="border border-gray-200 rounded-xl bg-white p-3 shadow-xs space-y-2">
                    <div class="flex justify-between items-start">
                        <div>
                            <span class="text-xs text-gray-500 font-semibold block mb-0.5">Tukar 200 Poin Jadi Diskon</span>
                            <span class="text-sm font-extrabold text-gray-900">15%</span>
                        </div>
                        <div class="flex space-x-3 text-lg">
                            <button class="text-red-500 hover:text-red-700"><i class="fa-regular fa-trash-can"></i></button>
                            <button class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-2">
                        <span class="text-xs font-bold text-emerald-600">Aktif</span>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked class="sr-only peer">
                            <div class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                        </label>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openFormSetPoinJadiDiskon()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SET POIN AWAL
                </button>
            </div>
        </div>

        <!-- Halaman Form Input Tukar Poin Jadi Diskon (SS 1000924628) -->
        <div id="view-form-tukar-diskon" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeFormSetPoinJadiDiskon()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Tukar Poin Jadi Diskon</h2>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div class="space-y-0.5">
                    <span class="text-xs font-semibold text-gray-500">Metode</span>
                    <h4 class="font-extrabold text-xs text-gray-900">Tukar Poin jadi diskon</h4>
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Besar Poin ditukar</label>
                    <input type="number" placeholder="Besar Poin ditukar" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-gray-600 mb-1.5">Besar Diskon</label>
                    <div class="flex rounded-full overflow-hidden border border-gray-300 focus-within:border-emerald-600">
                        <input type="number" placeholder="Besar Diskon" class="flex-1 p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none">
                        <button type="button" class="w-12 bg-emerald-600 text-white font-bold text-xs">%</button>
                        <button type="button" class="w-12 bg-gray-200 text-white font-bold text-xs">Rp</button>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="closeFormSetPoinJadiDiskon()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SIMPAN
                </button>
            </div>
        </div>

        <!-- === 8. HALAMAN TUKAR POIN JADI BARANG (SS 1000924629 - 1000924632) === -->
        <div id="view-tukar-poin-barang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-20">
                <button onclick="closeTukarPoinBarangView()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Tukar Poin Jadi Barang</h2>
            </div>

            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-20">
                <div class="relative">
                    <button onclick="toggleFilterTukarBarang()" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-filter-tukar-barang" class="absolute left-0 top-10 w-48 bg-emerald-50 rounded-md shadow-2xl py-1 hidden z-50 text-xs text-gray-900 border border-emerald-100">
                        <button onclick="alert('Sort by Nama'); toggleFilterTukarBarang();" class="w-full text-left px-4 py-2.5 font-bold transition block">Nama Barang</button>
                        <button onclick="alert('Sort by Kode'); toggleFilterTukarBarang();" class="w-full text-left px-4 py-2.5 hover:bg-emerald-100 transition block">Kode</button>
                        <button onclick="alert('Sort by Poin'); toggleFilterTukarBarang();" class="w-full text-left px-4 py-2.5 hover:bg-emerald-100 transition block">Poin</button>
                    </div>
                </div>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-700"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" placeholder="Cari nama atau kode barang" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
                <button class="text-emerald-700 text-2xl px-1"><i class="fa-solid fa-barcode"></i></button>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-3 pb-28">
                <div class="border border-gray-200 rounded-xl bg-white p-3.5 shadow-xs flex justify-between items-center">
                    <div>
                        <h4 class="font-extrabold text-xs text-gray-900">Celana</h4>
                        <p class="text-[11px] text-gray-500 font-semibold mt-0.5">celana</p>
                        <p class="text-emerald-600 font-bold text-xs mt-1.5"><i class="fa-regular fa-star mr-1"></i>1</p>
                    </div>
                    <div class="flex space-x-3 text-lg">
                        <button onclick="document.getElementById('modal-reset-poin').classList.remove('hidden')" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-arrow-rotate-left"></i></button>
                        <button onclick="document.getElementById('modal-set-poin').classList.remove('hidden')" class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                    </div>
                </div>

                <div class="border border-gray-200 rounded-xl bg-white p-3.5 shadow-xs flex justify-between items-center">
                    <div>
                        <h4 class="font-extrabold text-xs text-gray-900">Jaket</h4>
                        <p class="text-[11px] text-gray-500 font-semibold mt-0.5">jaket</p>
                        <p class="text-emerald-600 font-bold text-xs mt-1.5"><i class="fa-regular fa-star mr-1"></i>1000</p>
                    </div>
                    <div class="flex space-x-3 text-lg">
                        <button onclick="document.getElementById('modal-reset-poin').classList.remove('hidden')" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-arrow-rotate-left"></i></button>
                        <button onclick="document.getElementById('modal-set-poin').classList.remove('hidden')" class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                    </div>
                </div>
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="openFormSetPoinSekaligus()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    SET POIN SEKALIGUS
                </button>
            </div>
        </div>

        <!-- Halaman Form Poin Jadi Barang (SS 1000924632) -->
        <div id="view-form-poin-jadi-barang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeFormSetPoinSekaligus()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Poin jadi Barang</h2>
            </div>
            
            <div class="p-4 space-y-4">
                <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1.5">Poin Ditukar Jadi Barang</label>
                    <input type="number" class="w-full border border-emerald-600 rounded-full p-2.5 px-4 text-xs font-bold text-gray-900 focus:outline-none border-l-[3px] border-l-emerald-600">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="alert('Pilih Barang')" class="bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100 font-bold py-3 rounded-md text-xs shadow-xs transition">
                        <i class="fa-solid fa-plus mr-1.5"></i> Barang
                    </button>
                    <button onclick="alert('Pilih Kategori')" class="bg-emerald-100/50 text-emerald-600 hover:bg-emerald-100 font-bold py-3 rounded-md text-xs shadow-xs transition">
                        <i class="fa-solid fa-plus mr-1.5"></i> Kategori
                    </button>
                </div>
                <button class="w-full bg-gray-200 text-white font-bold py-3.5 rounded-full text-xs transition cursor-not-allowed">
                    Simpan
                </button>
            </div>
            <div class="flex-1 flex flex-col items-center justify-center border-t border-gray-100 bg-white relative">
                <div class="w-10 h-1 rounded-full bg-gray-300 absolute top-2"></div>
                <div class="text-gray-400 text-2xl mb-1"><i class="fa-solid fa-bars"></i></div>
            </div>
        </div>

        <!-- === 9. HALAMAN DAPAT POIN DARI TRANSAKSI (SS 1000924765 & 1000924766) === -->
        <div id="view-dapat-poin-trx" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeDapatPoinTransaksiView()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Dapat Poin dari Transaksi</h2>
            </div>

            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div class="flex justify-between items-start pt-1">
                    <div>
                        <p class="text-[11px] text-gray-500 font-semibold mb-1">Min. Transaksi Rp 2.000 Dapat</p>
                        <p class="font-extrabold text-sm text-gray-900">1 Poin</p>
                    </div>
                    <div class="flex space-x-3 text-lg">
                        <button class="text-red-500 hover:text-red-700"><i class="fa-regular fa-trash-can"></i></button>
                        <button onclick="document.getElementById('modal-edit-poin-trx').classList.remove('hidden')" class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button>
                    </div>
                </div>

                <div class="flex justify-between items-center py-4 border-b border-gray-100">
                    <span class="text-[11px] font-bold text-emerald-600">Aktif</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>

                <p class="text-[10px] text-gray-500 font-medium">*Hanya dapat menentukan 1 jenis minimal transaksi</p>
            </div>
        </div>

        <!-- === 10. HALAMAN DAPAT POIN DARI BARANG & LIST BARANG (SS 1000924767 - 1000924773) === -->
        <div id="view-dapat-poin-barang" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="closeDapatPoinBarangView()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Poin dari Barang</h2>
            </div>

            <div class="p-4 space-y-4 z-20 relative bg-white pb-6 shadow-xs">
                <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1.5">Poin Didapat Dari Barang</label>
                    <input type="number" class="w-full border border-gray-300 rounded-full p-2.5 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="openPickBarangLoyalty()" class="bg-emerald-100/60 text-emerald-600 hover:bg-emerald-100 font-bold py-3.5 rounded-lg text-xs shadow-xs transition border border-emerald-100 flex items-center justify-center">
                        <i class="fa-solid fa-plus mr-1.5"></i> Barang
                    </button>
                    <button onclick="openPickKategoriLoyalty()" class="bg-emerald-100/60 text-emerald-600 hover:bg-emerald-100 font-bold py-3.5 rounded-lg text-xs shadow-xs transition border border-emerald-100 flex items-center justify-center">
                        <i class="fa-solid fa-plus mr-1.5"></i> Kategori
                    </button>
                </div>
                <button class="w-full bg-gray-200 text-white font-bold py-3.5 rounded-full text-xs transition cursor-not-allowed">
                    Simpan
                </button>
            </div>

            <!-- Panel Bawah Daftar Barang/Kategori Terpilih -->
            <div class="flex-1 overflow-y-auto bg-white border-t border-gray-100 relative rounded-t-3xl -mt-4 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pt-2 pb-10">
                <div class="w-8 h-1 rounded-full bg-gray-300 mx-auto mb-3"></div>
                <div class="text-gray-400 text-center mb-4"><i class="fa-solid fa-bars text-xl"></i></div>
                <div class="px-4 pb-2">
                    <span class="text-[11px] font-semibold text-gray-600">Barang &amp; kategori yang terpilih</span>
                </div>
                <div class="px-4 space-y-2.5" id="container-selected-poin-barang">
                    <!-- Contoh 2 item jika dipilih, default kosong "Belum Ada Data" jika belum -->
                </div>
            </div>
        </div>

        <!-- Halaman List Pilih Barang / Kategori (SS 1000924768 - 1000924770) -->
        <div id="view-pick-barang-loyalty" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-white flex items-center space-x-3 z-10">
                <button onclick="closePickBarangLoyalty()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700" id="header-pick-loyalty">Pilih Barang</h2>
            </div>

            <!-- Tabs: Lihat Barang / Lihat Berdasar Poin -->
            <div id="wrapper-tabs-loyalty" class="grid grid-cols-2 text-xs font-bold text-center border-b border-emerald-600">
                <div class="py-2.5 border-b-[3px] border-emerald-600 text-gray-900 cursor-pointer">Lihat Barang</div>
                <div class="py-2.5 text-gray-500 cursor-pointer">Lihat Berdasar Poin</div>
            </div>

            <div class="p-3 bg-white border-b flex items-center space-x-2">
                <div class="relative">
                    <button onclick="document.getElementById('dropdown-loyalty-pick').classList.toggle('hidden')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-loyalty-pick" class="absolute left-0 top-10 w-40 bg-white rounded-md shadow-2xl py-1 hidden z-50 text-[11px] font-medium text-gray-900 border border-gray-100">
                        <button onclick="this.parentNode.classList.add('hidden')" class="w-full text-left px-4 py-2.5 bg-emerald-100/50 transition block">Nama Barang</button>
                        <button onclick="this.parentNode.classList.add('hidden')" class="w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition block">Kode</button>
                        <button onclick="this.parentNode.classList.add('hidden')" class="w-full text-left px-4 py-2.5 hover:bg-emerald-50 transition block">Poin</button>
                    </div>
                </div>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-700"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-search-pick-loyalty" placeholder="Nama atau Kode" class="w-full pl-9 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
                <button class="text-emerald-700 text-2xl px-1"><i class="fa-solid fa-barcode"></i></button>
            </div>

            <div class="px-4 py-2 bg-gray-50 text-[10px] text-gray-600 border-b border-gray-100" id="helper-pick-loyalty">
                Tidak menampilkan barang Multisatuan dan Varian
            </div>

            <div class="flex-1 overflow-y-auto px-4 py-2 space-y-4 pb-24" id="container-list-pick-loyalty"></div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="submitPickBarangLoyalty()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    LANJUTKAN
                </button>
            </div>
        </div>
    `;

    // 2. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <!-- === MODALS PROMOSI === -->
        <div id="modal-promo-nonaktifkan" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center space-y-4">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 border-b pb-3">NOTIFIKASI</h3>
                <div class="w-12 h-12 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-xl font-bold mx-auto mt-2">!</div>
                <p class="text-xs text-gray-700 font-medium">Apakah anda yakin ingin Menonaktifkan Promosi ini ?</p>
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <button onclick="this.closest('#modal-promo-nonaktifkan').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-full font-extrabold text-xs uppercase shadow-xs">BATAL</button>
                    <button onclick="this.closest('#modal-promo-nonaktifkan').classList.add('hidden'); alert('Promosi dinonaktifkan.');" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-extrabold text-xs uppercase shadow-md">IYA</button>
                </div>
            </div>
        </div>

        <div id="modal-promo-konfirmasi" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center space-y-4">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 border-b pb-3">KONFIRMASI</h3>
                <div class="w-12 h-12 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-xl font-bold mx-auto mt-2">i</div>
                <p class="text-[11px] text-gray-700 font-medium leading-relaxed">Anda baru saja mengubah data Promosi, Hubungi Staff anda untuk Sinkronisasi Promosi di device yang terhubung</p>
                <div class="pt-2">
                    <button onclick="this.closest('#modal-promo-konfirmasi').classList.add('hidden'); closeDetailPromosi();" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-full font-extrabold text-xs uppercase shadow-md">OK</button>
                </div>
            </div>
        </div>

        <!-- === MODALS LOYALTI POIN === -->
        <div id="modal-loyalty-info" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-sm w-full max-w-xs overflow-hidden shadow-2xl p-6 space-y-3">
                <h3 class="text-base text-gray-900">Set Poin Awal</h3>
                <p class="text-[13px] text-gray-600 font-medium leading-snug">Jika membuat pelanggan baru poin akan otomatis terisi</p>
                <div class="pt-4 text-right">
                    <button onclick="this.closest('#modal-loyalty-info').classList.add('hidden')" type="button" class="text-emerald-600 font-semibold text-sm px-2 py-1">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-reset-poin" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center space-y-4">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 border-b pb-3">RESET POIN</h3>
                <div class="w-12 h-12 mx-auto text-red-500 text-4xl mt-2"><i class="fa-solid fa-arrow-rotate-left"></i></div>
                <p class="text-xs text-gray-900 font-medium">Anda yakin mereset data Poin menjadi 0?</p>
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <button onclick="this.closest('#modal-reset-poin').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase shadow-xs">BATAL</button>
                    <button onclick="this.closest('#modal-reset-poin').classList.add('hidden')" type="button" class="bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md">IYA</button>
                </div>
            </div>
        </div>

        <div id="modal-set-poin" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 text-center border-b pb-3">SET POIN</h3>
                <div>
                    <h4 class="font-extrabold text-xs text-gray-900">Celana</h4>
                    <p class="text-[11px] text-gray-500 font-semibold mt-0.5">celana</p>
                </div>
                <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1.5">Poin didapat saat ini</label>
                    <input type="number" value="1" class="w-full border border-gray-300 rounded-full p-2.5 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <button onclick="this.closest('#modal-set-poin').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase">BATAL</button>
                    <button onclick="this.closest('#modal-set-poin').classList.add('hidden')" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md">SIMPAN</button>
                </div>
            </div>
        </div>

        <div id="modal-edit-poin-trx" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6 space-y-4">
                <h3 class="font-extrabold text-xs uppercase tracking-wider text-gray-900 text-center border-b pb-3">EDIT POIN</h3>
                <div class="space-y-1">
                    <span class="block text-[11px] font-semibold text-gray-600">Metode</span>
                    <span class="font-bold text-xs text-gray-900 block">Berdasarkan Transaksi</span>
                </div>
                <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1.5">Minimal Transaksi (Rp)</label>
                    <input type="text" value="Rp 2.000" class="w-full border border-gray-300 rounded-full p-2.5 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <label class="block text-[11px] font-semibold text-gray-600 mb-1.5">Mendapatkan Poin</label>
                    <input type="number" value="1" class="w-full border border-gray-300 rounded-full p-2.5 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div class="flex justify-between items-center py-2">
                    <span class="text-[11px] font-semibold text-gray-600">Berlaku Kelipatan</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked class="sr-only peer">
                        <div class="w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-1">
                    <button onclick="this.closest('#modal-edit-poin-trx').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase">BATAL</button>
                    <button onclick="this.closest('#modal-edit-poin-trx').classList.add('hidden')" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md">OK</button>
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
    // 3. LOGIKA PROMOSI (SS 1000924598 - 1000924606)
    // ========================================================================
    const samplePromotions = [
        { name: "Beko Jumbo", active: false },
        { name: "PP Petro", active: false },
        { name: "pp petromax", active: false },
        { name: "PP. Petromax disc", active: false },
        { name: "jet roll", active: false },
        { name: "diskon boom", active: false },
        { name: "promo duarr", active: true }
    ];

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
        const k = (keyword || '').toLowerCase();
        let list = samplePromotions.filter(p => p.name.toLowerCase().includes(k));

        if (list.length === 0) {
            container.innerHTML = `<div class="p-10 text-center text-xs text-gray-400">Tidak ada promosi.</div>`;
            return;
        }

        list.forEach(p => {
            const statusText = p.active ? '<span class="font-bold text-gray-900">Aktif</span>' : '<span class="font-bold text-gray-900">Tidak aktif</span>';
            container.innerHTML += `
                <div onclick="openDetailPromosi()" class="p-4 bg-white flex justify-between items-center hover:bg-gray-50 cursor-pointer">
                    <div>
                        <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Nama Promosi</span>
                        <span class="font-bold text-xs text-gray-900">${p.name}</span>
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="text-right">
                            <span class="block text-[11px] text-gray-500 font-semibold mb-0.5">Status</span>
                            ${statusText}
                        </div>
                        <i class="fa-solid fa-chevron-right text-emerald-700 text-base"></i>
                    </div>
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
        document.getElementById('view-form-promosi-hal2').classList.add('hidden');
        document.getElementById('view-form-promosi-hal3').classList.remove('hidden');
    };
    window.savePromosiBaru = () => {
        alert("Data Promosi baru berhasil disimpan!");
        document.getElementById('view-form-promosi-hal3').classList.add('hidden');
        document.getElementById('view-promosi-main').classList.remove('hidden');
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
        const icon = document.getElementById('icon-promo-ketentuan');
        box.classList.toggle('hidden');
        if (box.classList.contains('hidden')) {
            icon.className = "fa-solid fa-chevron-down";
        } else {
            icon.className = "fa-solid fa-chevron-up";
        }
    };

    window.openDetailPromosi = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-detail-promosi').classList.remove('hidden');
    };
    window.closeDetailPromosi = () => {
        document.getElementById('view-detail-promosi').classList.add('hidden');
        document.getElementById('view-promosi-main').classList.remove('hidden');
    };
    window.editPromosiSaved = () => {
        document.getElementById('modal-promo-konfirmasi').classList.remove('hidden');
    };

    // ========================================================================
    // 4. LOGIKA LOYALTI POIN (SS 1000924624 - 1000924773)
    // ========================================================================
    window.openLoyaltyPoinMainView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-loyalti-main').classList.remove('hidden');
    };

    // --- TUKAR POIN JADI DISKON ---
    window.openTukarPoinDiskonView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-tukar-poin-diskon').classList.remove('hidden');
    };
    window.closeTukarPoinDiskonView = () => {
        document.getElementById('view-tukar-poin-diskon').classList.add('hidden');
        document.getElementById('view-loyalti-main').classList.remove('hidden');
    };
    window.toggleFilterTukarDiskon = () => {
        document.getElementById('dropdown-filter-tukar-diskon').classList.toggle('hidden');
    };
    window.openFormSetPoinJadiDiskon = () => {
        document.getElementById('view-tukar-poin-diskon').classList.add('hidden');
        document.getElementById('view-form-tukar-diskon').classList.remove('hidden');
    };
    window.closeFormSetPoinJadiDiskon = () => {
        document.getElementById('view-form-tukar-diskon').classList.add('hidden');
        document.getElementById('view-tukar-poin-diskon').classList.remove('hidden');
    };

    // --- TUKAR POIN JADI BARANG ---
    window.openTukarPoinBarangView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-tukar-poin-barang').classList.remove('hidden');
    };
    window.closeTukarPoinBarangView = () => {
        document.getElementById('view-tukar-poin-barang').classList.add('hidden');
        document.getElementById('view-loyalti-main').classList.remove('hidden');
    };
    window.toggleFilterTukarBarang = () => {
        document.getElementById('dropdown-filter-tukar-barang').classList.toggle('hidden');
    };
    window.openFormSetPoinSekaligus = () => {
        document.getElementById('view-tukar-poin-barang').classList.add('hidden');
        document.getElementById('view-form-poin-jadi-barang').classList.remove('hidden');
    };
    window.closeFormSetPoinSekaligus = () => {
        document.getElementById('view-form-poin-jadi-barang').classList.add('hidden');
        document.getElementById('view-tukar-poin-barang').classList.remove('hidden');
    };

    // --- DAPAT POIN DARI TRANSAKSI ---
    window.openDapatPoinTransaksiView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-dapat-poin-trx').classList.remove('hidden');
    };
    window.closeDapatPoinTransaksiView = () => {
        document.getElementById('view-dapat-poin-trx').classList.add('hidden');
        document.getElementById('view-loyalti-main').classList.remove('hidden');
    };

    // --- DAPAT POIN DARI BARANG ---
    window.openDapatPoinBarangView = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-dapat-poin-barang').classList.remove('hidden');
        renderSelectedLoyaltyBarang();
    };
    window.closeDapatPoinBarangView = () => {
        document.getElementById('view-dapat-poin-barang').classList.add('hidden');
        document.getElementById('view-loyalti-main').classList.remove('hidden');
    };

    // Logic List Pilihan Barang
    let activeLoyaltyPickMode = 'barang'; // 'barang' atau 'kategori'
    let selectedLoyaltyItems = [];

    window.openPickBarangLoyalty = () => {
        activeLoyaltyPickMode = 'barang';
        document.getElementById('header-pick-loyalty').innerText = 'Pilih Barang';
        document.getElementById('helper-pick-loyalty').classList.remove('hidden');
        document.getElementById('wrapper-tabs-loyalty').classList.remove('hidden');
        document.getElementById('view-dapat-poin-barang').classList.add('hidden');
        document.getElementById('view-pick-barang-loyalty').classList.remove('hidden');
        renderPickLoyaltyList();
    };

    window.openPickKategoriLoyalty = () => {
        activeLoyaltyPickMode = 'kategori';
        document.getElementById('header-pick-loyalty').innerText = 'Pilih Kategori';
        document.getElementById('helper-pick-loyalty').classList.add('hidden');
        document.getElementById('wrapper-tabs-loyalty').classList.add('hidden');
        document.getElementById('view-dapat-poin-barang').classList.add('hidden');
        document.getElementById('view-pick-barang-loyalty').classList.remove('hidden');
        renderPickLoyaltyList();
    };

    window.closePickBarangLoyalty = () => {
        document.getElementById('view-pick-barang-loyalty').classList.add('hidden');
        document.getElementById('view-dapat-poin-barang').classList.remove('hidden');
    };

    window.submitPickBarangLoyalty = () => {
        document.querySelectorAll('input[name="chk-loyalty-pick"]:checked').forEach(c => {
            if (c.value !== 'all' && !selectedLoyaltyItems.some(x => x.id === c.value)) {
                selectedLoyaltyItems.push({ id: c.value, name: c.getAttribute('data-name'), sub: c.getAttribute('data-sub') });
            }
        });
        window.closePickBarangLoyalty();
        renderSelectedLoyaltyBarang();
    };

    window.removeSelectedLoyaltyItem = (idx) => {
        selectedLoyaltyItems.splice(idx, 1);
        renderSelectedLoyaltyBarang();
    };

    function renderSelectedLoyaltyBarang() {
        const container = document.getElementById('container-selected-poin-barang');
        if (!container) return;
        container.innerHTML = '';
        if (selectedLoyaltyItems.length === 0) {
            container.innerHTML = `<div class="text-center text-[11px] font-bold text-gray-300 py-6">Belum Ada Data</div>`;
        } else {
            selectedLoyaltyItems.forEach((item, idx) => {
                container.innerHTML += `
                    <div class="bg-slate-50 border border-gray-100 rounded-xl p-3 flex justify-between items-center shadow-xs">
                        <div>
                            <h4 class="font-extrabold text-xs text-gray-900">${item.name}</h4>
                            <p class="text-[10px] text-gray-500 font-semibold mt-0.5">${item.sub}</p>
                        </div>
                        <button onclick="removeSelectedLoyaltyItem(${idx})" class="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 flex items-center justify-center transition">
                            <i class="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>
                `;
            });
        }
    }

    function renderPickLoyaltyList() {
        const container = document.getElementById('container-list-pick-loyalty');
        if (!container) return;
        container.innerHTML = `
            <label class="flex items-center space-x-4 cursor-pointer pb-2 border-b border-gray-100">
                <input type="checkbox" value="all" onchange="document.querySelectorAll('input[name=\\'chk-loyalty-pick\\']').forEach(c => c.checked = this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                <span class="font-bold text-xs text-gray-900">Pilih Semua</span>
            </label>
        `;

        if (activeLoyaltyPickMode === 'kategori') {
            const cats = window.masterCategories || ['atk', 'bahan makanan', 'baskom', 'cup gelas', 'diskon', 'foam', 'hari ultah', 'jet roll', 'kardus'];
            cats.forEach(c => {
                container.innerHTML += `
                    <label class="flex items-center space-x-4 cursor-pointer py-1">
                        <input type="checkbox" name="chk-loyalty-pick" value="cat_${c}" data-name="${c}" data-sub="Kategori" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span class="font-bold text-xs text-gray-900">${c}</span>
                    </label>
                `;
            });
        } else {
            const list = [
                { id: "b_1", name: "Beken Nat Merah 15x30", sku: "bekennat1530" },
                { id: "b_2", name: "Celana", sku: "celana" },
                { id: "b_3", name: "Cup 100ml IC*50+ttp", sku: "paket196" },
                { id: "b_4", name: "Cup 100ml IC*isi 100", sku: "CupICBintang100ml" },
                { id: "b_5", name: "Cup 100ml IC*isi 100+ttp", sku: "cupic100mlttp" },
                { id: "b_6", name: "Cup 100ml IC*isi50", sku: "196" },
                { id: "b_7", name: "HOK 60ml", sku: "354" },
                { id: "b_8", name: "HOK 60ml+ttp", sku: "paket354" }
            ];
            list.forEach(p => {
                container.innerHTML += `
                    <label class="flex items-center space-x-4 cursor-pointer py-0.5">
                        <input type="checkbox" name="chk-loyalty-pick" value="${p.id}" data-name="${p.name}" data-sub="${p.sku}" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <div>
                            <span class="font-bold text-xs text-gray-900 block">${p.name}</span>
                            <span class="text-[11px] text-gray-500 font-semibold block">${p.sku}</span>
                        </div>
                    </label>
                `;
            });
        }
    }
})();
