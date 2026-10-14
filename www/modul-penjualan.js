// ============================================================================
// MODUL 14: TRANSAKSI PENJUALAN (POS UTAMA) - FINAL LENGKAP
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN UTAMA POS (PENJUALAN) === -->
        <div id="view-penjualan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <!-- Header -->
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-4">
                    <button onclick="switchView('manajemen-hub')" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-bars"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Penjualan</h2>
                </div>
                <div class="flex items-center space-x-3">
                    <button class="bg-amber-400 hover:bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-sm">
                        <span>13</span><i class="fa-solid fa-bell"></i>
                    </button>
                    <button onclick="posOpenCustomerPoin()" class="w-8 h-8 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-sm"><i class="fa-regular fa-star"></i></button>
                    <div class="relative">
                        <button onclick="document.getElementById('dropdown-pos-main').classList.toggle('hidden')" class="text-emerald-700 text-xl p-1 focus:outline-none"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div id="dropdown-pos-main" class="absolute right-0 top-10 w-56 bg-white rounded-md shadow-2xl py-1 hidden z-50 border border-gray-100">
                            <button onclick="posBatalkanTransaksi()" class="w-full text-left px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-emerald-50 transition block">Batalkan transaksi</button>
                            <button onclick="posBukaPengaturan()" class="w-full text-left px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-emerald-50 transition block">Pengaturan Transaksi</button>
                            <button onclick="alert('Mode Optimasi Diaktifkan')" class="w-full text-left px-4 py-3 text-xs font-semibold text-gray-700 hover:bg-emerald-50 transition block">Mode Optimasi (NEW)</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Baris Alat (Toolbar) -->
            <div class="px-3 py-2 bg-white border-b relative z-20 h-14 flex items-center" id="pos-toolbar-normal">
                <div class="flex justify-between items-center w-full text-emerald-700 text-xl px-2">
                    <button onclick="posToggleSearchBar(true)"><i class="fa-solid fa-magnifying-glass"></i></button>
                    <button onclick="document.getElementById('modal-pos-add-temp').classList.remove('hidden')"><i class="fa-solid fa-plus"></i></button>
                    <button onclick="if(window.openScannerView) window.openScannerView('pos')"><i class="fa-solid fa-expand"></i></button>
                    <button onclick="posToggleBarcodeBar(true)"><i class="fa-solid fa-barcode"></i></button>
                    <button onclick="document.getElementById('modal-pos-global-disc').classList.remove('hidden')"><i class="fa-solid fa-percent"></i></button>
                    <button onclick="document.getElementById('modal-pos-global-tax').classList.remove('hidden')" class="text-sm font-bold border-b-2 border-emerald-700 pb-0.5">TAX</button>
                </div>
            </div>

            <!-- Baris Alat (Search Mode) -->
            <div class="px-3 py-2 bg-white border-b relative z-20 h-14 flex items-center hidden space-x-2" id="pos-toolbar-search">
                <div class="relative flex-1">
                    <input type="text" id="input-pos-search" oninput="renderPosProductList(this.value)" placeholder="Cari nama atau kode" class="w-full pl-3 pr-4 py-2 border border-emerald-600 rounded-lg text-xs font-bold text-gray-900 focus:outline-none">
                </div>
                <label class="flex items-center space-x-1.5 cursor-pointer text-xs font-bold text-gray-700">
                    <input type="checkbox" class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                    <span>Kode</span>
                </label>
                <button onclick="document.getElementById('input-pos-search').value=''; renderPosProductList('');" class="text-red-500 text-xs font-bold px-1">Hapus</button>
                <button onclick="posToggleSearchBar(false)" class="text-emerald-700 text-xl px-1"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <!-- Baris Alat (Barcode Input Mode) -->
            <div class="px-3 py-2 bg-white border-b relative z-20 h-14 flex items-center hidden space-x-2" id="pos-toolbar-barcode">
                <div class="relative flex-1">
                    <input type="text" placeholder="Klik disini dan scan barcode" class="w-full pl-3 pr-4 py-2 border-b-2 border-emerald-600 text-xs font-bold text-emerald-700 focus:outline-none bg-transparent">
                </div>
                <button onclick="posToggleBarcodeBar(false)" class="text-emerald-700 text-xl px-2"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <!-- Kategori Scroll -->
            <div class="bg-white border-b py-2 px-3 overflow-x-auto whitespace-nowrap hide-scrollbar flex space-x-2 items-center" id="container-pos-categories">
                <button onclick="document.getElementById('modal-pos-filter').classList.remove('hidden')" class="text-emerald-700 text-lg px-2"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                <button onclick="posSelectCategory('all')" id="btn-pos-cat-all" class="bg-emerald-50 border border-emerald-500 text-emerald-600 px-3 py-1.5 rounded-full text-[11px] font-bold transition">Semua</button>
                <button onclick="posSelectCategory('atk')" id="btn-pos-cat-atk" class="bg-white border border-emerald-500 text-emerald-600 px-3 py-1.5 rounded-full text-[11px] font-bold transition">atk</button>
                <button onclick="posSelectCategory('bahan makanan')" id="btn-pos-cat-bm" class="bg-white border border-emerald-500 text-emerald-600 px-3 py-1.5 rounded-full text-[11px] font-bold transition">bahan makanan</button>
            </div>

            <!-- Daftar Produk -->
            <div class="flex-1 overflow-y-auto pb-24 bg-white" id="container-pos-products" onclick="document.getElementById('dropdown-pos-main').classList.add('hidden')"></div>

            <!-- Bar Hijau Bawah (Sticky) -->
            <div class="p-4 bg-transparent absolute bottom-0 left-0 right-0 z-10 flex space-x-2">
                <button onclick="posLanjutKeReview()" type="button" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg flex justify-between items-center text-xs uppercase tracking-wider transition active:scale-95">
                    <span><span id="pos-cart-count" class="text-base font-extrabold mr-1">0</span> Barang</span>
                    <span>LANJUT <i class="fa-solid fa-chevron-right ml-2"></i></span>
                </button>
                <button onclick="posOpenInputCustomer()" type="button" class="w-14 h-12 rounded-xl bg-white border border-emerald-600 text-emerald-600 flex items-center justify-center text-xl shadow-lg relative transition hover:bg-emerald-50">
                    <i class="fa-regular fa-user"></i>
                    <span id="pos-cust-dot" class="hidden absolute top-2 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </div>

        <!-- === 2. HALAMAN INPUT KONTAK / PEMBELI === -->
        <div id="view-pos-input-customer" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-white flex items-center space-x-3 shadow-sm z-10">
                <button onclick="document.getElementById('view-pos-input-customer').classList.add('hidden'); document.getElementById('view-penjualan').classList.remove('hidden');" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Input Kontak atau Pembeli</h2>
            </div>
            
            <div class="flex-1 p-4 space-y-5">
                <div>
                    <span class="block text-xs font-semibold text-gray-500 mb-2">Pelanggan</span>
                    
                    <!-- Mode Belum Pilih -->
                    <button id="btn-pos-pick-cust" onclick="posOpenDaftarPelanggan()" class="w-full bg-white border border-emerald-600 text-emerald-600 font-bold py-3 rounded-lg text-xs hover:bg-emerald-50 transition">
                        Klik untuk menambahkan pelanggan
                    </button>
                    
                    <!-- Mode Sudah Pilih -->
                    <div id="box-pos-cust-selected" class="hidden relative border-b border-gray-200 pb-3 mb-2">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm" id="pos-sel-cust-av">AB</div>
                            <div>
                                <span class="font-bold text-sm text-gray-900 block" id="pos-sel-cust-name">004 Bu iin Sebaluh</span>
                                <span class="text-[10px] text-gray-500 font-semibold block" id="pos-sel-cust-phone">624</span>
                                <span class="text-emerald-600 font-bold text-xs mt-1 block flex items-center"><i class="fa-regular fa-star mr-1"></i> <span id="pos-sel-cust-poin">0 Poin</span></span>
                            </div>
                        </div>
                        <button onclick="posClearCustomer()" class="absolute top-0 right-0 text-gray-400 hover:text-red-500 text-2xl"><i class="fa-solid fa-xmark"></i></button>
                        
                        <div class="bg-gray-100 rounded-lg p-3 mt-4 flex space-x-2 text-[10px] font-semibold text-gray-700">
                            <i class="fa-solid fa-circle-info mt-0.5"></i>
                            <p><b>Tukar, Tambah / Kurang Poin</b> dapat dilakukan pada halaman Pembayaran.</p>
                        </div>
                    </div>
                </div>

                <div class="flex items-center justify-center text-gray-400 text-sm font-semibold space-x-4">
                    <div class="h-px bg-gray-200 flex-1"></div><span>atau</span><div class="h-px bg-gray-200 flex-1"></div>
                </div>

                <div>
                    <span class="block text-[11px] font-semibold text-gray-500 mb-2 leading-tight">Inputkan nama pembeli tanpa dimasukkan ke database pelanggan</span>
                    <input type="text" id="input-pos-casual-name" placeholder="Nama Pembeli" class="w-full border border-emerald-600 rounded-lg p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none mb-3">
                    <button onclick="posSaveCustomer()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-lg transition active:scale-95 text-xs uppercase tracking-wider">
                        SIMPAN
                    </button>
                </div>
            </div>
        </div>

        <div id="view-pos-list-customer" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-white flex items-center space-x-3 shadow-sm z-10 border-b">
                <button onclick="document.getElementById('view-pos-list-customer').classList.add('hidden'); document.getElementById('view-pos-input-customer').classList.remove('hidden');" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pilih Pelanggan</h2>
            </div>
            <div class="p-3 bg-white border-b flex items-center space-x-2">
                <button class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" placeholder="Nama, email atau no telp" class="w-full pl-10 pr-4 py-2.5 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
                <button class="text-emerald-700 text-xl px-1"><i class="fa-solid fa-barcode"></i></button>
            </div>
            
            <div class="flex-1 overflow-y-auto pb-24 divide-y divide-gray-100" id="container-pos-cust-list">
                <!-- Disuntik via JS -->
            </div>

            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10 text-center">
                <span class="text-[10px] font-bold text-gray-700 block mb-2">Tambah Pelanggan</span>
                <div class="flex space-x-3">
                    <button class="flex-1 bg-amber-500 text-white font-bold py-3.5 rounded-full text-xs shadow-sm">Dari Kontak</button>
                    <button class="flex-1 bg-emerald-600 text-white font-bold py-3.5 rounded-full text-xs shadow-sm">Manual</button>
                </div>
            </div>
        </div>

        <!-- === 3. HALAMAN REVIEW (KERANJANG CHECKOUT) === -->
        <div id="view-pos-review" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative">
            <div class="px-4 py-3 bg-white border-b flex justify-between items-center shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-pos-review').classList.add('hidden'); document.getElementById('view-penjualan').classList.remove('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Review</h2>
                </div>
                <div class="flex items-center space-x-2">
                    <h2 class="text-base font-extrabold text-gray-900" id="pos-review-gtotal">Rp 0</h2>
                    <button onclick="document.getElementById('modal-pos-rincian-trx').classList.remove('hidden')" class="w-5 h-5 rounded-full border border-emerald-600 text-emerald-600 flex items-center justify-center text-[10px] font-bold">i</button>
                </div>
            </div>

            <!-- Tab Biaya Tambahan (Bila ada) -->
            <div class="px-4 py-2 bg-white flex justify-end border-b border-gray-100 relative z-10">
                <button onclick="document.getElementById('modal-pos-biaya-tambahan').classList.remove('hidden')" class="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center space-x-1"><i class="fa-solid fa-plus"></i><span>Biaya</span></button>
            </div>
            <div id="pos-review-biaya-label" class="hidden px-4 py-2 bg-white border-b border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-600 cursor-pointer hover:bg-gray-50" onclick="document.getElementById('modal-pos-rincian-biaya').classList.remove('hidden')">
                <span>Diskon : -</span>
                <span>Pajak : -</span>
                <span>Biaya Layanan: - <i class="fa-solid fa-chevron-down text-emerald-600"></i></span>
                <span>BIAYA : <span id="pos-review-biaya-val">Rp 10.000</span> <i class="fa-solid fa-chevron-down text-emerald-600"></i></span>
            </div>

            <!-- Daftar Keranjang -->
            <div class="flex-1 overflow-y-auto bg-white" id="container-pos-review-items"></div>

            <!-- Footer Section -->
            <div class="bg-white border-t border-gray-200">
                <div class="flex border-b border-gray-100 text-xs font-bold text-gray-600">
                    <button onclick="document.getElementById('modal-pos-potensi-untung').classList.remove('hidden')" class="flex-1 py-3.5 border-r border-gray-100 flex justify-center items-center space-x-2 hover:bg-gray-50">
                        <span>Untung</span><i class="fa-regular fa-circle-question text-emerald-600"></i>
                    </button>
                    <button class="flex-1 py-3.5 border-r border-gray-100 flex justify-center items-center space-x-2 text-emerald-600 hover:bg-gray-50">
                        <span>Promosi</span><i class="fa-solid fa-chevron-right text-[10px]"></i>
                    </button>
                    <button onclick="posOpenInputCustomer()" class="flex-1 py-3.5 flex justify-center items-center space-x-2 hover:bg-gray-50">
                        <span id="pos-review-cust-name" class="truncate max-w-[80px]">Pilih Pelanggan</span><i class="fa-regular fa-user text-emerald-600 text-sm"></i>
                    </button>
                </div>
                <div class="p-4 flex space-x-3 bg-gray-50">
                    <button onclick="document.getElementById('modal-pos-share').classList.remove('hidden')" class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm hover:bg-emerald-200"><i class="fa-solid fa-share-nodes"></i></button>
                    <button onclick="document.getElementById('modal-pos-print-sebagai').classList.remove('hidden')" class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm hover:bg-emerald-200"><i class="fa-solid fa-print"></i></button>
                    <button onclick="document.getElementById('view-pos-review').classList.add('hidden'); document.getElementById('view-penjualan').classList.remove('hidden');" class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm hover:bg-emerald-200"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="posGoToPembayaran()" class="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">CHECKOUT</button>
                </div>
            </div>
        </div>

        <!-- === 4. HALAMAN PEMBAYARAN KASIR === -->
        <div id="view-pos-pembayaran" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative">
            <div class="px-4 py-3 bg-white flex justify-between items-center z-20">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-pos-pembayaran').classList.add('hidden'); document.getElementById('view-pos-review').classList.remove('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Pembayaran</h2>
                </div>
                <div class="flex items-center space-x-2">
                    <h2 class="text-base font-extrabold text-gray-900" id="pos-pay-gtotal-header">Rp 0</h2>
                    <button id="btn-pos-pay-submit" onclick="posSelesaiTransaksi()" class="w-7 h-7 rounded-lg bg-gray-200 text-white flex items-center justify-center text-sm transition pointer-events-none">
                        <i class="fa-solid fa-check"></i>
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 pb-4 flex flex-col">
                <div class="flex justify-between items-center py-2">
                    <button onclick="alert('Rincian Poin')" class="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-md flex items-center space-x-1"><i class="fa-solid fa-star"></i><span id="pos-pay-poin">+10 Poin</span><i class="fa-solid fa-chevron-right text-[9px] ml-1"></i></button>
                    <button onclick="posOpenPisahBayar()" class="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center space-x-1"><i class="fa-solid fa-right-left"></i><span>Pisah Bayar</span></button>
                </div>
                
                <h1 class="text-3xl font-extrabold text-gray-400 text-center py-2 pb-4 transition-colors duration-300" id="pos-pay-display-cash">Rp 0</h1>

                <div class="flex items-center space-x-3 mb-3">
                    <label class="flex items-center space-x-2 cursor-pointer text-xs font-bold text-gray-900">
                        <input type="checkbox" id="chk-pos-pay-piutang" onchange="posTogglePiutang(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span>Piutang</span>
                    </label>
                    <div onclick="posOpenInputCustomer()" class="flex-1 bg-white border border-emerald-600 rounded-lg p-3 text-xs font-bold text-emerald-700 cursor-pointer truncate" id="box-pos-pay-cust">Pilih Pelanggan</div>
                    <div onclick="document.getElementById('modal-pos-no-meja').classList.remove('hidden')" class="w-24 bg-white border border-gray-300 rounded-lg p-3 text-xs font-bold text-gray-500 cursor-pointer text-center" id="box-pos-pay-meja">No. Meja</div>
                </div>

                <div class="mb-3">
                    <input type="text" id="input-pos-pay-notes" placeholder="Keterangan Struk" class="w-full bg-gray-100 rounded-lg p-3 text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                </div>

                <div class="flex space-x-2 mb-3 text-[10px] font-bold text-gray-600">
                    <div class="flex-1 border border-gray-300 rounded-lg p-2.5 flex justify-center items-center">Diskon : 0%</div>
                    <div class="flex-1 border border-gray-300 rounded-lg p-2.5 flex justify-center items-center">Pajak : 0%</div>
                    <div class="flex-1 relative cursor-pointer" onclick="document.getElementById('modal-pos-pay-method').classList.remove('hidden')">
                        <div class="border border-gray-900 rounded-lg p-2.5 flex justify-between items-center text-gray-900">
                            <span id="pos-pay-method-label">Metode : Cash</span><i class="fa-solid fa-chevron-down"></i>
                        </div>
                    </div>
                </div>

                <div class="relative mb-4">
                    <select class="w-full border border-gray-300 rounded-lg p-3 text-xs font-bold text-gray-900 appearance-none bg-white focus:outline-none">
                        <option>Dilayani Oleh : -</option>
                        <option>Adm</option>
                    </select>
                    <i class="fa-solid fa-chevron-down text-gray-800 text-xs absolute right-3 top-3.5 pointer-events-none"></i>
                </div>

                <button id="btn-pos-slide-manual" onclick="posSlideNumpad('left')" class="w-full bg-white border border-emerald-600 text-emerald-700 font-bold py-3 rounded-t-xl shadow-sm text-xs items-center justify-between px-4 hidden transition mb-2">
                    <div class="flex items-center space-x-2"><i class="fa-regular fa-keyboard text-lg"></i><span>Ketik Nominal</span></div>
                    <i class="fa-solid fa-chevron-right"></i>
                </button>

                <!-- SLIDER NUMPAD -->
                <div class="flex-1 relative overflow-hidden mt-1 bg-gray-50 rounded-2xl p-2 pb-0">
                    <div id="pos-slider-track" class="absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-300 ease-in-out pb-4">
                        
                        <!-- Panel Kiri: Numpad Manual -->
                        <div class="w-1/2 h-full px-2">
                            <div class="grid grid-cols-4 gap-2 h-full">
                                <button onclick="posNumpadInput('7')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">7</button>
                                <button onclick="posNumpadInput('8')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">8</button>
                                <button onclick="posNumpadInput('9')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">9</button>
                                <button onclick="posNumpadInput('C')" class="bg-gray-200 rounded-xl shadow-xs text-xl font-bold text-gray-600 active:bg-gray-300">C</button>
                                
                                <button onclick="posNumpadInput('4')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">4</button>
                                <button onclick="posNumpadInput('5')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">5</button>
                                <button onclick="posNumpadInput('6')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">6</button>
                                <button onclick="posNumpadInput('X')" class="bg-gray-100 rounded-xl shadow-xs text-xl font-bold text-emerald-700 active:bg-gray-200"><i class="fa-solid fa-delete-left"></i></button>
                                
                                <button onclick="posNumpadInput('1')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">1</button>
                                <button onclick="posNumpadInput('2')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">2</button>
                                <button onclick="posNumpadInput('3')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">3</button>
                                <button onclick="posSlideNumpad('right')" class="bg-emerald-100 border border-emerald-300 rounded-xl shadow-xs flex flex-col justify-center items-center text-emerald-700 active:bg-emerald-200 row-span-2">
                                    <span class="text-[11px] font-bold mb-1 border-b border-emerald-300 pb-1">Auto</span><i class="fa-solid fa-money-bill-wave text-2xl"></i>
                                </button>
                                
                                <button onclick="posNumpadInput('0')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">0</button>
                                <button onclick="posNumpadInput('000')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">000</button>
                                <button onclick="posNumpadInput('.')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100">.</button>
                            </div>
                        </div>

                        <!-- Panel Kanan: Nominal Cepat -->
                        <div class="w-1/2 h-full px-2 overflow-y-auto">
                            <div class="grid grid-cols-2 gap-3" id="pos-fastcash-container"></div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

        <!-- === 5. HALAMAN PISAH BAYAR (SPLIT) === -->
        <div id="view-pos-split-pay" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative z-50">
            <div class="px-4 py-3 bg-white border-b flex justify-between items-center shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="posClosePisahBayar()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-extrabold text-gray-900" id="pos-split-gtotal">Rp 30.500 <i class="fa-solid fa-circle-info text-emerald-600 ml-1 text-xs"></i></h2>
                </div>
                <button onclick="posClosePisahBayar()" class="text-red-500 text-xs font-bold px-2 py-1 flex items-center space-x-1"><i class="fa-solid fa-xmark"></i><span>Batal Pisah Bayar</span></button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                    <div class="flex items-center space-x-3 mb-2"><span class="font-extrabold text-xs text-gray-900">Pembayaran 1</span><span class="bg-gray-200 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase" id="pos-split-m1">TRANSFER</span></div>
                    <span class="block text-[11px] font-semibold text-gray-500 mb-1">Nominal Pembayaran</span>
                    <input type="number" id="input-split-1" oninput="posCalcSplit()" value="10000" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                    <div class="bg-emerald-100 text-emerald-800 text-[10px] font-semibold p-2.5 rounded-lg mt-2 flex space-x-2 items-start"><i class="fa-solid fa-circle-info mt-0.5"></i><p>Pembayaran dengan metode ini hanya sebagai label</p></div>
                </div>
                <div>
                    <div class="flex items-center space-x-3 mb-2"><span class="font-extrabold text-xs text-gray-900">Pembayaran 2</span><span class="bg-gray-200 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase" id="pos-split-m2">CASH</span></div>
                    <span class="block text-[11px] font-semibold text-gray-500 mb-1">Nominal Pembayaran</span>
                    <input type="number" id="input-split-2" readonly value="20500" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 bg-gray-50 focus:outline-none">
                    <div class="bg-emerald-100 text-emerald-800 text-[10px] font-semibold p-2.5 rounded-lg mt-2 flex space-x-2 items-start"><i class="fa-solid fa-circle-info mt-0.5"></i><p>Pembayaran dengan metode ini hanya sebagai label</p></div>
                </div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="document.getElementById('modal-pos-confirm-split').classList.remove('hidden')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SELESAIKAN TRANSAKSI</button>
            </div>
        </div>

        <!-- === 6. HALAMAN TRANSAKSI BERHASIL === -->
        <div id="view-pos-success" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-emerald-50 hidden relative z-50">
            <div class="flex-1 overflow-y-auto p-4 flex flex-col items-center">
                <div class="w-full bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center mt-6">
                    <h2 class="text-lg font-extrabold text-gray-900 mb-4">Transaksi Berhasil!</h2>
                    <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center relative mb-6">
                        <i class="fa-solid fa-cash-register text-4xl text-emerald-300"></i>
                        <div class="absolute -bottom-1 -left-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs border-2 border-white"><i class="fa-solid fa-check"></i></div>
                    </div>
                    <div class="w-full space-y-3 text-xs font-semibold text-gray-600 mb-4 px-2">
                        <div class="flex justify-between items-center"><span>Kembalian</span><span class="text-gray-900 font-bold" id="pos-succ-change">Rp 0</span></div>
                        <div class="flex justify-between items-center border-b border-gray-200 pb-4 mb-2"><span>Poin di dapat</span><span class="text-emerald-600 font-bold flex items-center"><i class="fa-regular fa-star mr-1"></i> <span id="pos-succ-poin">10 Poin</span></span></div>
                    </div>
                    <div class="w-full space-y-2 text-xs font-extrabold text-gray-900">
                        <button onclick="document.getElementById('modal-pos-do-print').classList.remove('hidden')" class="w-full flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50"><span>Cetak Struk</span><i class="fa-solid fa-chevron-right text-gray-400"></i></button>
                        <button onclick="alert('Cetak Checker')" class="w-full flex justify-between items-center py-2.5 border-b border-gray-100 hover:bg-gray-50 text-left">
                            <div><span class="block">Cetak Checker</span><span class="block text-[9px] font-medium text-gray-500 mt-0.5">*Struk tanpa harga. Kategori barang disesuaikan dengan transaksi</span></div><i class="fa-solid fa-chevron-right text-gray-400"></i>
                        </button>
                        <button onclick="alert('Cetak Struk Pesanan')" class="w-full flex justify-between items-center py-2.5 border-b border-gray-100 hover:bg-gray-50 text-left">
                            <div><span class="block">Cetak Struk Pesanan</span><span class="block text-[9px] font-medium text-gray-500 mt-0.5">*Dengan Harga</span></div><i class="fa-solid fa-chevron-right text-gray-400"></i>
                        </button>
                        <div class="w-full border border-emerald-600 rounded-lg p-3 flex justify-between items-center text-emerald-700 bg-emerald-50/50">
                            <div><span class="block">Proses Cetak Struk</span><span class="block text-[9px] font-medium text-emerald-600 mt-0.5">*Proses cetak struk sedang berjalan</span></div><i class="fa-solid fa-chevron-right"></i>
                        </div>
                        <div class="relative w-full">
                            <button onclick="document.getElementById('dropdown-pos-succ-lainnya').classList.toggle('hidden')" class="w-full flex justify-between items-center py-3 hover:bg-gray-50"><span>Lainnya</span><i class="fa-solid fa-chevron-down text-gray-400"></i></button>
                            <div id="dropdown-pos-succ-lainnya" class="absolute right-0 top-10 w-full bg-white rounded-md shadow-lg py-1 hidden z-50 border border-gray-100 text-left font-semibold">
                                <button onclick="posOpenPrinterSettings()" class="w-full px-4 py-3 hover:bg-emerald-50 transition border-b border-gray-100">Pengaturan Printer</button>
                                <button onclick="posViewDigitalReceipt()" class="w-full px-4 py-3 hover:bg-emerald-50 transition">Lihat Struk</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="w-full mt-6 space-y-2 text-center">
                    <span class="text-[10px] font-bold text-gray-700">Kirim Struk</span>
                    <div class="flex space-x-3">
                        <button class="flex-1 bg-white border border-gray-300 rounded-full py-3 text-[11px] font-bold text-gray-600 flex items-center justify-center space-x-1.5 shadow-sm"><i class="fa-regular fa-envelope text-emerald-500"></i><span>Ke Email</span></button>
                        <button class="flex-1 bg-white border border-gray-300 rounded-full py-3 text-[11px] font-bold text-gray-600 flex items-center justify-center space-x-1.5 shadow-sm"><i class="fa-brands fa-whatsapp text-emerald-500"></i><span>Ke Whatsapp</span></button>
                    </div>
                </div>
            </div>
            <div class="p-4 w-full">
                <button onclick="posKembaliKeAwal()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SELESAI</button>
            </div>
        </div>

        <!-- === 7. STRUK DIGITAL & PENGATURAN PRINTER === -->
        <div id="view-pos-struk" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-emerald-500 hidden relative z-50">
            <div class="px-4 py-3 flex justify-between items-center text-white z-10">
                <div class="flex items-center space-x-4">
                    <button onclick="document.getElementById('view-pos-struk').classList.add('hidden');" class="text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                    <h2 class="text-base font-bold uppercase tracking-wider">STRUK</h2>
                </div>
                <div class="flex items-center space-x-4 text-xl">
                    <button onclick="alert('Mengunduh Struk...')"><i class="fa-solid fa-download"></i></button>
                    <button onclick="alert('Buka Modal Share Struk')"><i class="fa-solid fa-share-nodes"></i></button>
                    <div class="relative">
                        <button onclick="document.getElementById('dropdown-pos-struk-menu').classList.toggle('hidden')" class="focus:outline-none"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div id="dropdown-pos-struk-menu" class="absolute right-0 top-8 w-40 bg-white rounded-md shadow-2xl py-1 hidden z-50 text-xs font-semibold text-gray-700">
                            <button onclick="alert('Cetak'); this.parentNode.classList.add('hidden');" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Cetak Struk</button>
                            <button onclick="posOpenRincianJson(); this.parentNode.classList.add('hidden');" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Rincian</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4 pb-12 flex justify-center" onclick="document.getElementById('dropdown-pos-struk-menu').classList.add('hidden')">
                <div class="bg-white w-full max-w-sm rounded-sm shadow-2xl p-6 relative overflow-hidden" style="background-image: radial-gradient(circle at 10px 0, transparent 10px, white 11px), radial-gradient(circle at 10px 100%, transparent 10px, white 11px); background-size: 20px 100%; background-repeat: repeat-x;">
                    <div class="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDEwLDAgMjAsMTAiIGZpbGw9IiNlY2ZjZjciLz48L3N2Zz4=')]"></div>
                    <div class="absolute bottom-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgMTAsMTAgMjAsMCIgZmlsbD0iI2VjZmNmNyIvPjwvc3ZnPg==')] transform rotate-180"></div>
                    <div id="content-pos-struk-digital" class="pt-4 pb-2 text-[11px] font-mono text-gray-900 leading-snug"></div>
                </div>
            </div>
        </div>

        <div id="view-pos-rincian-json" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="document.getElementById('view-pos-rincian-json').classList.add('hidden'); document.getElementById('view-pos-struk').classList.remove('hidden');" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Rincian Struk</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-4 bg-gray-50"><pre id="pos-content-rincian-json" class="text-[10px] text-gray-700 whitespace-pre-wrap font-mono"></pre></div>
        </div>

        <div id="view-pos-printer" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-white border-b flex items-center justify-between shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-pos-printer').classList.add('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Pengaturan Printer</h2>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto pb-20 bg-gray-50 divide-y divide-gray-200">
                <div class="bg-white p-4 space-y-3">
                    <div class="flex justify-between items-center"><span class="font-extrabold text-sm text-gray-900">Struk Transaksi<br><span class="font-semibold text-[10px] text-gray-500">1 Connected</span></span><button class="border border-emerald-600 text-emerald-700 font-bold text-[10px] px-3 py-1.5 rounded flex items-center"><i class="fa-solid fa-plus mr-1"></i>Tambah</button></div>
                    <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"><div><span class="font-bold text-sm text-gray-900">RPP02N <i class="fa-solid fa-star text-amber-400 text-[10px]"></i></span><span class="block text-[9px] text-gray-500">86:67:7A:D8:6E:D5</span></div><button onclick="posEditPrinter()" class="text-emerald-600 text-lg"><i class="fa-solid fa-pen"></i></button></div>
                </div>
                <div class="bg-white p-4 space-y-3">
                    <div class="flex justify-between items-center"><span class="font-extrabold text-sm text-gray-900">Struk Pesanan<br><span class="font-semibold text-[10px] text-gray-500">1 Connected</span></span><button class="border border-emerald-600 text-emerald-700 font-bold text-[10px] px-3 py-1.5 rounded flex items-center"><i class="fa-solid fa-plus mr-1"></i>Tambah</button></div>
                    <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"><div><span class="font-bold text-sm text-gray-900">RPP02N</span><span class="block text-[9px] text-gray-500">86:67:7A:D8:6E:D5</span></div><button onclick="posEditPrinter()" class="text-emerald-600 text-lg"><i class="fa-solid fa-pen"></i></button></div>
                </div>
                <div class="bg-white p-4 space-y-3">
                    <div class="flex justify-between items-center"><span class="font-extrabold text-sm text-gray-900">Checker<br><span class="font-semibold text-[10px] text-gray-500">1 Connected</span></span><button class="border border-emerald-600 text-emerald-700 font-bold text-[10px] px-3 py-1.5 rounded flex items-center"><i class="fa-solid fa-plus mr-1"></i>Tambah</button></div>
                    <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100"><div><span class="font-bold text-sm text-gray-900">RPP02N</span><span class="block text-[9px] text-gray-500">86:67:7A:D8:6E:D5</span></div><button onclick="posEditPrinter()" class="text-emerald-600 text-lg"><i class="fa-solid fa-pen"></i></button></div>
                </div>
                <div class="bg-white p-4 flex justify-between items-center">
                    <span class="font-extrabold text-sm text-gray-900">Struk Label</span><span class="bg-amber-400 text-white font-bold text-[10px] px-3 py-1.5 rounded">Segera Hadir!</span>
                </div>
            </div>
        </div>

        <div id="view-pos-printer-edit" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="document.getElementById('view-pos-printer-edit').classList.add('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-gray-900">Struk Transaksi</h2>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div class="bg-gray-100 text-[10px] text-gray-600 font-semibold p-3 rounded-lg">Mencetak struk transaksi/pembayaran untuk pelanggan. Bisa juga untuk kebutuhan lain (print retur, export laporan dll)</div>
                <div class="flex justify-between items-center"><span class="font-bold text-xs text-gray-900">Printer<br><span class="text-sm">RPP02N</span></span><span class="text-red-500 font-bold text-xs cursor-pointer">Putuskan Sambungan</span></div>
                <div><span class="block text-xs font-semibold text-gray-600 mb-1.5">Jenis Kertas</span><div class="relative"><select class="w-full border border-emerald-600 rounded-full p-3 px-4 text-xs font-bold text-gray-900 appearance-none bg-white focus:outline-none"><option>58 mm</option></select><i class="fa-solid fa-chevron-down text-gray-800 text-xs absolute right-4 top-3.5 pointer-events-none"></i></div></div>
                <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"><span class="font-bold text-xs text-gray-900">Auto Print di Transaksi</span></label>
                <label class="flex items-center space-x-3 cursor-pointer"><input type="checkbox" checked class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"><span class="font-bold text-xs text-gray-900 flex items-center">Jadikan Sebagai Printer Utama <i class="fa-solid fa-circle-info text-emerald-600 ml-2"></i></span></label>
                <div class="flex justify-between items-center"><span class="text-xs font-semibold text-gray-600">Jumlah Tercetak</span><div class="flex space-x-4 font-bold text-sm"><button>-</button><span>1</span><button>+</button></div></div>
                <div class="flex items-end space-x-3">
                    <div class="flex-1"><span class="block text-xs font-semibold text-gray-600 mb-1.5">Panjang Karakter Struk</span><input type="number" value="32" readonly class="w-full border border-gray-300 rounded-lg p-3 px-4 text-xs font-bold text-gray-400 bg-gray-50 focus:outline-none"></div>
                    <button class="bg-emerald-100 text-emerald-700 font-bold text-xs px-4 py-3 rounded-lg">Edit</button>
                </div>
                <div><span class="block text-xs font-semibold text-gray-600 mb-1.5">Jumlah Margin Baris Bawah</span><input type="number" value="1" class="w-full border border-gray-300 rounded-lg p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none"></div>
            </div>
            <div class="p-4 bg-white border-t space-y-3 relative z-10">
                <button onclick="alert('Print Test Dikirim!')" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-extrabold py-3.5 rounded-full shadow-xs transition text-xs uppercase">SIMPAN DAN TEST PRINT</button>
                <button onclick="document.getElementById('view-pos-printer-edit').classList.add('hidden');" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3.5 rounded-full shadow-md transition text-xs uppercase">SIMPAN</button>
            </div>
        </div>
    `;

    // 2. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <!-- === MODALS POS (ADD TEMP, DISKON, PAJAK, FILTER, MULTISATUAN) === -->
        <div id="modal-pos-add-temp" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">TRANSAKSI TAMBAHAN</h3>
                <div class="space-y-3 mb-4">
                    <input type="text" placeholder="Barang atau jasa" class="w-full border border-emerald-600 rounded-md p-3 px-4 font-bold text-gray-900 focus:outline-none text-sm">
                    <input type="text" placeholder="Kode" class="w-full border border-emerald-600 rounded-md p-3 px-4 font-bold text-gray-900 focus:outline-none text-sm">
                    <input type="number" placeholder="Harga dasar" class="w-full border border-emerald-600 rounded-md p-3 px-4 font-bold text-gray-900 focus:outline-none text-sm">
                    <input type="number" placeholder="Harga jual" class="w-full border border-emerald-600 rounded-md p-3 px-4 font-bold text-gray-900 focus:outline-none text-sm">
                    <div class="flex justify-center items-center space-x-10 py-2 text-2xl font-extrabold">
                        <button><i class="fa-solid fa-minus"></i></button><span>1</span><button><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-0 pt-2 border-t border-gray-100">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="text-emerald-600 hover:bg-gray-50 py-3 font-extrabold text-xs uppercase transition border-r border-gray-200">BATAL</button>
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="text-emerald-600 hover:bg-gray-50 py-3 font-extrabold text-xs uppercase transition">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-global-disc" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-t-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 absolute bottom-0 left-1/2 transform -translate-x-1/2 h-3/4 flex flex-col">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center">PILIH DISKON</h3>
                <div class="space-y-3 flex-1 overflow-y-auto">
                    <div class="flex border border-emerald-600 rounded-full overflow-hidden">
                        <input type="number" value="0.0" class="flex-1 p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none">
                        <button type="button" class="w-12 bg-emerald-600 text-white font-bold text-xs">%</button>
                        <button type="button" class="w-12 bg-gray-200 text-gray-500 font-bold text-xs">Rp</button>
                    </div>
                    <input type="text" placeholder="Nama Diskon" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-semibold text-gray-900 focus:outline-none">
                    <div class="pt-4 divide-y divide-gray-100 font-bold text-gray-900 text-xs cursor-pointer">
                        <div class="py-2.5"><span>set</span><span class="block text-[10px] text-gray-500 font-semibold mt-0.5">Rp 5.000</span></div>
                        <div class="py-2.5"><span>set</span><span class="block text-[10px] text-gray-500 font-semibold mt-0.5">Rp 4.000</span></div>
                        <div class="py-2.5"><span>set</span><span class="block text-[10px] text-gray-500 font-semibold mt-0.5">Rp 3.000</span></div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">ATUR</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-global-tax" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-t-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 absolute bottom-0 left-1/2 transform -translate-x-1/2 h-3/4 flex flex-col">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center">PILIH PAJAK</h3>
                <div class="space-y-4 flex-1 overflow-y-auto text-xs font-bold text-gray-900">
                    <label class="flex items-center justify-between cursor-pointer">
                        <div class="flex items-center space-x-3"><input type="radio" name="rad_pos_tax" value="default" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300" checked><span>Gunakan Default</span></div>
                        <span class="bg-gray-100 px-3 py-1.5 rounded-md text-gray-600">0 %</span>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="rad_pos_tax" value="custom" class="w-5 h-5 text-gray-400 focus:ring-emerald-500 border-gray-300"><span>Set 0 atau lainnya</span>
                    </label>
                    <div class="pt-4 border-t border-gray-100 space-y-1 cursor-pointer"><h4 class="font-extrabold">QRIS</h4><p class="text-[11px] text-gray-500 font-semibold">1 %</p></div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SET</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-filter" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center border-b border-gray-100 pb-3">FILTER</h3>
                <div class="space-y-4 text-xs font-bold text-gray-900 pb-4">
                    <span class="block mb-1 font-semibold">Urutan</span>
                    <div class="relative mb-4"><select class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 appearance-none bg-white focus:outline-none"><option>Urutan Turun</option></select><i class="fa-solid fa-chevron-down text-gray-800 text-xs absolute right-4 top-3.5 pointer-events-none"></i></div>
                    
                    <span class="block mb-2 font-semibold pt-2">Sortir Berdasarkan</span>
                    <label class="flex items-center space-x-3 cursor-pointer mb-2"><input type="radio" name="rad_pos_sort" value="name" class="w-5 h-5 text-emerald-600 focus:ring-emerald-500 border-gray-300" checked><span>Nama Barang</span></label>
                    <label class="flex items-center space-x-3 cursor-pointer mb-2"><input type="radio" name="rad_pos_sort" value="code" class="w-5 h-5 text-gray-400 focus:ring-emerald-500 border-gray-300"><span>Kode</span></label>
                    <label class="flex items-center space-x-3 cursor-pointer mb-2"><input type="radio" name="rad_pos_sort" value="price" class="w-5 h-5 text-gray-400 focus:ring-emerald-500 border-gray-300"><span>Harga jual</span></label>
                    <label class="flex items-center space-x-3 cursor-pointer mb-2"><input type="radio" name="rad_pos_sort" value="stock" class="w-5 h-5 text-gray-400 focus:ring-emerald-500 border-gray-300"><span>Stok</span></label>
                    <label class="flex items-center space-x-3 cursor-pointer mb-2"><input type="radio" name="rad_pos_sort" value="new" class="w-5 h-5 text-gray-400 focus:ring-emerald-500 border-gray-300"><span>Produk Terbaru</span></label>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">TERAPKAN</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-multisatuan" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-sm w-full max-w-sm overflow-hidden shadow-2xl p-6 relative">
                <div class="flex justify-between items-start mb-4 border-b border-gray-100 pb-3">
                    <div class="flex space-x-3">
                        <div class="w-12 h-12 rounded bg-slate-100 flex items-center justify-center text-gray-400 font-bold text-sm shadow-inner overflow-hidden" id="pos-mul-img">AW</div>
                        <div>
                            <h4 class="font-extrabold text-sm text-gray-900" id="pos-mul-name">Alta Wrap 30x30 box</h4>
                            <p class="text-[10px] text-gray-500 font-semibold mt-0.5" id="pos-mul-sku">alta30x30box</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-[11px] text-gray-900 font-bold" id="pos-mul-price">Rp 16.000</p>
                        <p class="text-[10px] text-gray-500 font-semibold mt-0.5"><span id="pos-mul-stock">57</span> <span id="pos-mul-unit">box</span></p>
                    </div>
                </div>

                <div class="space-y-4 text-xs font-bold text-gray-900 mb-4">
                    <span id="pos-mul-unit-label" class="block">box</span>
                    <div class="flex justify-center items-center space-x-12 py-2 text-2xl font-extrabold border border-gray-200 rounded-lg w-full max-w-[200px] mx-auto">
                        <button onclick="posAdjQty(-1)"><i class="fa-solid fa-minus text-gray-400"></i></button><span id="pos-mul-qty-val">1</span><button onclick="posAdjQty(1)"><i class="fa-solid fa-plus text-gray-400"></i></button>
                    </div>
                </div>

                <div class="space-y-4 text-xs pb-4">
                    <div>
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-pos-mul-tempprice" onchange="document.getElementById('box-pos-mul-tempprice').classList.toggle('hidden', !this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                            <span class="font-bold text-gray-900">ubah harga sementara</span>
                        </label>
                        <div id="box-pos-mul-tempprice" class="hidden mt-2"><input type="number" id="input-pos-mul-tempprice" value="16000" class="w-full border border-emerald-600 rounded-md p-3 px-4 font-bold text-gray-900 focus:outline-none"></div>
                    </div>
                    <div>
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-pos-mul-diskon" onchange="document.getElementById('box-pos-mul-diskon').classList.toggle('hidden', !this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                            <span class="font-bold text-gray-900">ubah diskon per box</span>
                        </label>
                        <div id="box-pos-mul-diskon" class="hidden flex mt-2 border border-emerald-600 rounded-md overflow-hidden">
                            <input type="number" id="input-pos-mul-diskon-val" value="0" class="flex-1 p-3 px-4 font-bold text-gray-900 focus:outline-none">
                            <button type="button" class="w-12 bg-emerald-600 text-white font-bold text-xs">%</button><button type="button" class="w-12 bg-emerald-700 text-white font-bold text-xs">Rp</button>
                        </div>
                    </div>
                    <div>
                        <label class="flex items-center space-x-3 cursor-pointer">
                            <input type="checkbox" id="chk-pos-mul-notes" onchange="document.getElementById('box-pos-mul-notes').classList.toggle('hidden', !this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                            <span class="font-bold text-gray-900">Tambah catatan singkat</span>
                        </label>
                        <div id="box-pos-mul-notes" class="hidden mt-2 relative">
                            <input type="text" id="input-pos-mul-notes-val" placeholder="Tuliskan catatan singkat" class="w-full border border-emerald-600 rounded-md p-3 pr-10 pl-4 font-bold text-gray-900 focus:outline-none">
                            <button onclick="document.getElementById('view-pos-notes-template').classList.remove('hidden')" class="absolute right-2 top-2 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-0 pt-2 border-t border-gray-100">
                    <button onclick="document.getElementById('modal-pos-multisatuan').classList.add('hidden')" type="button" class="text-gray-500 hover:bg-gray-50 py-3 font-extrabold text-xs uppercase transition border-r border-gray-200">BATAL</button>
                    <button onclick="posAddToCart()" type="button" class="text-emerald-600 hover:bg-emerald-50 py-3 font-extrabold text-xs uppercase transition">OK</button>
                </div>
            </div>
        </div>

        <div id="view-pos-notes-template" class="fixed inset-0 bg-white z-[60] hidden flex-col">
            <div class="px-4 py-3 bg-emerald-600 flex items-center space-x-3 shadow-sm z-10 text-white">
                <button onclick="document.getElementById('view-pos-notes-template').classList.add('hidden')" class="text-xl font-bold p-1"><i class="fa-solid fa-xmark"></i></button>
                <h2 class="text-sm font-bold flex-1 text-center pr-6">Template Catatan</h2>
            </div>
            <div class="p-3 bg-emerald-600 pb-4">
                <div class="relative bg-white rounded flex items-center p-2"><i class="fa-solid fa-magnifying-glass text-gray-400 mr-2"></i><input type="text" placeholder="Cari catatan" class="flex-1 text-xs font-bold text-gray-900 focus:outline-none"></div>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div onclick="posApplyNoteTemplate('delivery')" class="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2"><div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-[10px]">DE</div><span class="font-bold text-xs text-gray-900">delivery</span></div>
                <div onclick="posApplyNoteTemplate('dine in')" class="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2"><div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-[10px]">DI</div><span class="font-bold text-xs text-gray-900">dine in</span></div>
            </div>
            <button class="absolute bottom-6 right-6 w-14 h-14 bg-cyan-400 rounded-full text-white shadow-xl flex items-center justify-center text-2xl hover:bg-cyan-500 transition"><i class="fa-solid fa-plus"></i></button>
        </div>

        <!-- === MODALS TUKAR POIN (SS 1000926146 - 1000926148) === -->
        <div id="modal-pos-tukar-poin-qty" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">PILIH BARANG</h3>
                <div class="bg-gray-50 p-3 rounded-lg flex justify-between items-center text-[11px] font-semibold text-gray-600 mb-4"><span>Poin saat ini:</span><span class="font-extrabold text-gray-900">9948</span></div>
                <div class="flex items-center space-x-3 mb-6">
                    <div class="w-10 h-10 rounded bg-gray-100 text-gray-300 flex items-center justify-center text-xl"><i class="fa-solid fa-cube"></i></div>
                    <div><span class="font-extrabold text-xs text-gray-900 block">Jaket</span><span class="text-[10px] text-gray-500 block">jaket</span><span class="text-emerald-600 font-bold text-[10px] flex items-center mt-1"><i class="fa-regular fa-star mr-1"></i>1000</span></div>
                </div>
                <div class="flex justify-center items-center space-x-12 py-2 text-2xl font-extrabold border border-gray-200 rounded-xl w-full max-w-[200px] mx-auto mb-6">
                    <button onclick="posPoinAdjQty(-1)"><i class="fa-solid fa-minus text-gray-400"></i></button><span id="pos-poin-qty-val">1</span><button onclick="posPoinAdjQty(1)"><i class="fa-solid fa-plus text-gray-400"></i></button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="posPoinSaveQty()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SIMPAN</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-tukar-poin-confirm" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">PILIH BARANG</h3>
                <p class="text-xs font-bold text-gray-900 mb-4">Apakah Anda yakin untuk menukar poin ?</p>
                <div class="space-y-2.5 text-xs font-semibold text-gray-600 mb-6">
                    <div class="flex justify-between items-center"><div class="flex items-center space-x-2"><i class="fa-regular fa-star text-gray-300"></i><span>Poin Sebelumnya</span></div><span class="text-gray-900">9948</span></div>
                    <div class="flex justify-between items-center"><div class="flex items-center space-x-2"><i class="fa-regular fa-star text-gray-300"></i><span>Poin Akan Ditukar</span></div><span class="text-gray-900" id="poin-will-deduct">1000</span></div>
                    <div class="flex justify-between items-center text-emerald-600"><div class="flex items-center space-x-2"><i class="fa-regular fa-star"></i><span class="font-bold">Sisa Poin</span></div><span class="font-bold" id="poin-will-remain">8948</span></div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="posPoinCheckoutSuccess()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">IYA</button>
                </div>
            </div>
        </div>

        <!-- === MODALS REVIEW / CHECKOUT (BIAYA, POTENSI, ORDER) === -->
        <div id="modal-pos-biaya-tambahan" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center">MODUL BIAYA</h3>
                <div class="space-y-4 text-xs font-semibold text-gray-600">
                    <button class="w-full bg-emerald-100/50 border border-emerald-500 text-emerald-700 font-bold py-3 rounded-lg flex items-center px-4 justify-between"><span>Tambah biaya ongkir</span><i class="fa-solid fa-plus bg-emerald-500 text-white p-1 rounded-full text-[10px]"></i></button>
                    <div><label class="block mb-1">Nama Biaya (Ex: Bungkus, Stiker, dll)</label><input type="text" id="input-pos-rin-biaya-name" placeholder="Ongkir" class="w-full border border-gray-300 rounded-full p-3.5 px-4 font-bold text-gray-900 focus:outline-none focus:border-emerald-600"></div>
                    <div>
                        <label class="block mb-1">Nominal</label>
                        <div class="flex border border-gray-300 rounded-full overflow-hidden focus-within:border-emerald-600">
                            <div class="bg-emerald-50 text-emerald-700 font-bold px-4 flex items-center justify-center border-r border-gray-300">Rp</div>
                            <input type="number" id="input-pos-rin-biaya-val" placeholder="0" class="flex-1 p-3.5 px-3 font-bold text-gray-900 focus:outline-none">
                        </div>
                    </div>
                    <div class="text-center pt-1"><span class="text-[10px] text-gray-400">Apa itu modul biaya ? <i class="fa-solid fa-chevron-down ml-1"></i></span></div>
                    <div class="pt-2"><span class="block mb-2">Daftar Biaya</span>
                        <div onclick="posApplyBiaya(10000)" class="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition border border-transparent hover:border-gray-200">
                            <div><span class="font-bold text-gray-900 block">Ongkir</span><span class="text-[10px] text-gray-500">Rp 10.000</span></div>
                            <div class="flex space-x-3 text-lg"><button class="text-emerald-600 hover:text-emerald-800"><i class="fa-solid fa-pen"></i></button><button class="text-red-500 hover:text-red-700"><i class="fa-regular fa-trash-can"></i></button></div>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-6">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-rincian-biaya" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-6 text-center">Rincian Biaya</h3>
                <div class="space-y-4 text-xs font-bold text-gray-900 mb-6">
                    <div class="flex justify-between items-center">
                        <span class="text-gray-600 font-semibold">Ongkir</span><div class="flex items-center space-x-3"><span>Rp 10.000</span><button onclick="posRemoveBiaya()" class="text-red-500 text-lg"><i class="fa-regular fa-trash-can"></i></button></div>
                    </div>
                    <div class="flex justify-between items-center pt-2">
                        <span>Potensi Untung</span><span>Rp 10.000</span>
                    </div>
                </div>
                <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase shadow-xs transition">OK, MENGERTI</button>
            </div>
        </div>

        <div id="modal-pos-potensi-untung" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-6 text-center">Rincian Potensi Untung</h3>
                <div class="space-y-3 text-xs font-semibold text-gray-600 mb-6 border-b border-gray-100 pb-4">
                    <div class="flex justify-between items-center"><span>Total Untung</span><div class="flex items-center space-x-2"><span class="text-gray-900">Rp 7.313,34</span><i class="fa-solid fa-circle-info text-emerald-600"></i></div></div>
                    <div class="flex justify-between items-center"><span>Total Diskon</span><div class="flex items-center space-x-2"><span class="text-gray-900">Rp 0</span><i class="fa-solid fa-circle-info text-emerald-600"></i></div></div>
                    <div class="flex justify-between items-center"><span>Potongan Reward</span><div class="flex items-center space-x-2"><span class="text-gray-900">Rp 0</span><i class="fa-solid fa-circle-info text-emerald-600"></i></div></div>
                </div>
                <div class="flex justify-between items-center text-xs font-extrabold text-gray-900 mb-6"><span>Potensi Untung</span><span>Rp 7.313,34</span></div>
                <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase shadow-xs transition">OK, MENGERTI</button>
            </div>
        </div>

        <div id="view-pos-simpan-pesanan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-white border-b flex items-center space-x-3 shadow-sm z-10">
                <button onclick="document.getElementById('view-pos-simpan-pesanan').classList.add('hidden');" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Buat Pesanan</h2>
            </div>
            <div class="bg-white border-b py-3 px-4 overflow-x-auto whitespace-nowrap hide-scrollbar flex space-x-2" id="container-pos-order-types">
                <button class="bg-gray-100 text-gray-500 font-bold text-xs px-4 py-2 rounded-full hover:bg-gray-200">Walk In</button>
                <button class="bg-gray-100 text-gray-500 font-bold text-xs px-4 py-2 rounded-full hover:bg-gray-200">Ambil Di Tempat</button>
                <button class="bg-gray-100 text-gray-500 font-bold text-xs px-4 py-2 rounded-full hover:bg-gray-200">Pesan Antar</button>
                <button class="bg-gray-100 text-gray-500 font-bold text-xs px-4 py-2 rounded-full hover:bg-gray-200">Drive Thru</button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div><span class="block text-xs font-semibold text-gray-600 mb-1.5">Nama pesanan</span><input type="text" value="Transaksi-13" class="w-full border border-emerald-600 rounded-full p-3.5 px-4 text-xs font-bold text-emerald-700 bg-emerald-50/30 focus:outline-none"></div>
                <div class="grid grid-cols-2 gap-4">
                    <div><span class="block text-xs font-semibold text-gray-600 mb-1.5">Pelanggan</span><input type="text" value="004 Bu iin Sebaluh" readonly class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-500 bg-gray-50 focus:outline-none"></div>
                    <div><span class="block text-xs font-semibold text-gray-600 mb-1.5">No. Meja</span><input type="text" placeholder="No. Meja" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600"></div>
                </div>
                <div><span class="block text-xs font-semibold text-gray-600 mb-1.5">Jatuh Tempo</span><div class="border border-gray-300 rounded-full p-3 px-4 flex items-center space-x-3"><i class="fa-regular fa-calendar text-emerald-700 text-base"></i><input type="text" placeholder="Jatuh Tempo" class="flex-1 text-xs font-bold text-gray-900 focus:outline-none"></div></div>
                <div><span class="block text-xs font-semibold text-gray-600 mb-1.5">Keterangan Struk</span><textarea rows="3" placeholder="Keterangan Struk" class="w-full border border-gray-300 rounded-xl p-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600"></textarea></div>
                <label class="flex items-center space-x-3 cursor-pointer pt-2"><input type="checkbox" checked class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"><span class="font-bold text-xs text-gray-900">Lihat Review Setelah Simpan</span></label>
                <div class="text-center text-gray-400 pt-10"><i class="fa-solid fa-print text-3xl mb-3"></i><p class="text-[10px] font-semibold">Cetak Pesanan dapat dilakukan di halaman Review</p></div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="document.getElementById('view-pos-simpan-pesanan').classList.add('hidden'); alert('Pesanan disimpan!');" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SIMPAN</button>
            </div>
        </div>

        <div id="modal-pos-rincian-trx" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-6 text-center">RINCIAN TRANSAKSI</h3>
                <div class="space-y-3 text-xs font-semibold text-gray-600 mb-6 border-b border-gray-100 pb-4">
                    <div class="flex justify-between items-center"><span>Sub Total</span><span class="text-gray-900 font-bold" id="pos-rin-sub">Rp 20.500</span></div>
                    <div class="flex justify-between items-start"><span>Biaya:<br>Ongkir</span><span class="text-gray-900 font-bold mt-3" id="pos-rin-fee">Rp 10.000</span></div>
                </div>
                <div class="flex justify-between items-center text-xs font-extrabold text-gray-900 mb-6"><span>Total</span><span id="pos-rin-tot">Rp 30.500</span></div>
                <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK, MENGERTI</button>
            </div>
        </div>

        <!-- === MODALS PEMBAYARAN & BERHASIL (PISAH BAYAR, SHARE, CETAK) === -->
        <div id="modal-pos-pilih-pay-method" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">PILIH PEMBAYARAN</h3>
                <div class="bg-gray-50 border border-gray-100 p-3 rounded-lg flex justify-between items-center mb-4 text-[11px] font-bold text-gray-900"><span>Integrasi Ewallet <span class="text-emerald-600">di sini</span></span><i class="fa-solid fa-circle-info text-emerald-600 text-sm"></i></div>
                <div class="grid grid-cols-2 gap-3 mb-6">
                    <button onclick="posSelectPaymentMethod('Cash')" id="btn-pay-m-Cash" class="w-full bg-white border border-gray-300 text-gray-900 font-bold py-4 rounded-xl shadow-xs text-xs hover:bg-emerald-50 transition">Cash</button>
                    <button onclick="posSelectPaymentMethod('Transfer')" id="btn-pay-m-Transfer" class="w-full bg-emerald-100/50 border border-emerald-500 text-gray-900 font-bold py-4 rounded-xl shadow-xs text-xs transition">Transfer</button>
                    <button onclick="posSelectPaymentMethod('QRIS 0,5%')" id="btn-pay-m-QRIS 0,5%" class="w-full bg-white border border-gray-300 text-gray-900 font-bold py-4 rounded-xl shadow-xs text-xs hover:bg-emerald-50 transition">QRIS 0,5%</button>
                    <button onclick="posSelectPaymentMethod('QRIS Free')" id="btn-pay-m-QRIS Free" class="w-full bg-white border border-gray-300 text-gray-900 font-bold py-4 rounded-xl shadow-xs text-xs hover:bg-emerald-50 transition">QRIS Free</button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="posApplyPaymentMethod()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SET</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-no-meja" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">MEJA</h3>
                <div class="space-y-4 text-xs font-bold text-gray-900 mb-6">
                    <div><span class="block text-gray-600 font-semibold mb-1">No. Meja</span><input type="text" placeholder="No. Meja" class="w-full border border-gray-300 rounded-full p-3 px-4 font-bold text-gray-900 focus:outline-none focus:border-emerald-600 text-center text-sm"></div>
                    <div>
                        <span class="block text-gray-600 font-semibold mb-2">Jumlah Orang</span>
                        <div class="flex justify-center items-center space-x-12 py-2 text-2xl font-extrabold border border-gray-200 rounded-xl w-full max-w-[200px] mx-auto">
                            <button><i class="fa-solid fa-minus text-gray-400"></i></button><span>1</span><button><i class="fa-solid fa-plus text-gray-400"></i></button>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-poin-detail" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-6 text-center">POIN</h3>
                <div class="space-y-3 text-xs font-semibold text-gray-600 mb-6 border-b border-gray-100 pb-4">
                    <div class="flex justify-between items-center"><span>Poin Didapat</span><span class="text-gray-900 font-bold">10</span></div>
                    <div class="flex justify-between items-center"><span>Poin Ditukar</span><span class="text-gray-900 font-bold">0</span></div>
                </div>
                <div class="flex justify-between items-center text-xs font-extrabold text-gray-900 mb-6"><span>Total Perubahan Poin</span><span>10</span></div>
                <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
            </div>
        </div>

        <div id="modal-pos-split-select" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">PILIH 2 PEMBAYARAN</h3>
                <div class="bg-emerald-100/50 border border-emerald-100 p-3 rounded-lg flex space-x-3 items-start mb-4 text-[10px] font-semibold text-gray-900"><i class="fa-solid fa-circle-info text-emerald-600 text-sm mt-0.5"></i><p>Pembulatan tidak akan diterapkan pada Pisah Bayar</p></div>
                <div class="grid grid-cols-2 gap-3 mb-6 font-bold text-xs">
                    <button class="w-full bg-emerald-50 border border-emerald-500 text-emerald-700 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2"><i class="fa-solid fa-circle-check"></i><span>Cash</span></button>
                    <button class="w-full bg-emerald-50 border border-emerald-500 text-emerald-700 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2"><i class="fa-solid fa-circle-check"></i><span>Transfer</span></button>
                    <button class="w-full bg-white border border-gray-300 text-gray-400 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2"><i class="fa-regular fa-circle-check"></i><span>QRIS 0,5%</span></button>
                    <button class="w-full bg-white border border-gray-300 text-gray-400 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2"><i class="fa-regular fa-circle-check"></i><span>QRIS Free</span></button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="posConfirmSplitSelect()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SET</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-confirm-split" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6 text-center space-y-4">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-2">KONFIRMASI</h3>
                <div class="w-12 h-12 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-2xl font-bold mx-auto mt-2">!</div>
                <p class="text-xs font-bold text-gray-600 pb-2">Apakah Anda yakin ingin menyelesaikan transaksi?</p>
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="posSelesaiTransaksi(true)" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SELESAI</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-print-sebagai" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center border-b border-gray-100 pb-3">PRINT SEBAGAI</h3>
                <div class="space-y-4 text-xs font-bold text-gray-900 pb-4">
                    <span class="text-[11px] text-gray-500 font-semibold block mb-2">Print sebagai</span>
                    <label class="flex items-start space-x-3 cursor-pointer">
                        <input type="radio" name="rad_pos_print_mode" value="checker" class="w-5 h-5 mt-0.5 text-emerald-600 focus:ring-emerald-500 border-gray-300" checked>
                        <div><span class="block">Checker (tanpa harga)</span><span class="block text-[10px] text-gray-500 font-medium mt-1 leading-relaxed">Hasil cetak disesuaikan dengan kategori barang yang telah disimpan pada pesanan ini</span></div>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="rad_pos_print_mode" value="harga" class="w-5 h-5 text-gray-400 focus:ring-emerald-500 border-gray-300"><span>Struk Pesanan (dengan harga)</span>
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="this.closest('.fixed').classList.add('hidden'); alert('Mencetak struk...');" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">CETAK</button>
                </div>
            </div>
        </div>
        
        <div id="modal-pos-share" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center border-b border-gray-100 pb-3">BAGIKAN SEBAGAI</h3>
                <div class="space-y-4 text-xs font-bold text-gray-900 pb-4">
                    <span class="text-[11px] text-gray-500 font-semibold block mb-2">Bagikan Sebagai</span>
                    <label class="flex items-start space-x-3 cursor-pointer">
                        <input type="radio" name="rad_pos_share_mode" value="checker" class="w-5 h-5 mt-0.5 text-emerald-600 focus:ring-emerald-500 border-gray-300" checked>
                        <div><span class="block">Checker (tanpa harga)</span><span class="block text-[10px] text-gray-500 font-medium mt-1 leading-relaxed">Hasil cetak disesuaikan dengan kategori barang yang telah disimpan pada pesanan ini</span></div>
                    </label>
                    <label class="flex items-center space-x-3 cursor-pointer">
                        <input type="radio" name="rad_pos_share_mode" value="harga" class="w-5 h-5 text-gray-400 focus:ring-emerald-500 border-gray-300"><span>Struk Pesanan (dengan harga)</span>
                    </label>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="this.closest('.fixed').classList.add('hidden'); document.getElementById('modal-share-struk').classList.remove('hidden');" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">BAGIKAN</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-do-print" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">CETAK STRUK</h3>
                <div class="space-y-4 font-bold text-xs text-gray-900 mb-6">
                    <div class="flex justify-between items-center py-1 border-b border-emerald-600"><div><span class="block mb-0.5">Struk Transaksi</span><span class="text-[10px] font-semibold text-gray-500">RPP02N</span></div><div class="w-6 h-6 rounded-full bg-emerald-500 text-white flex justify-center items-center"><i class="fa-solid fa-check"></i></div></div>
                    <div class="flex justify-between items-center py-1 border-b border-emerald-600"><div><span class="block mb-0.5">Struk Dapur</span><span class="text-[10px] font-semibold text-gray-500">RPP02N</span></div><div class="w-6 h-6 rounded-full bg-emerald-500 text-white flex justify-center items-center"><i class="fa-solid fa-check"></i></div></div>
                    <div class="flex justify-between items-center py-1 border-b border-emerald-600"><div><span class="block mb-0.5">Struk Pesanan</span><span class="text-[10px] font-semibold text-gray-500">RPP02N</span></div><div class="w-6 h-6 rounded-full bg-emerald-500 text-white flex justify-center items-center"><i class="fa-solid fa-check"></i></div></div>
                </div>
                <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">TUTUP</button>
            </div>
        </div>
    `;

    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    const mdContainer = document.getElementById('modals-container');
    if (mdContainer) mdContainer.insertAdjacentHTML('beforeend', modalsHTML);


    // ========================================================================
    // 3. STATE & LOGIKA POS PENJUALAN
    // ========================================================================
    let posCart = []; 
    let posCustomer = null; 
    let posBiayaNominal = 0;
    let paymentCashAmount = 0;
    let activeProductToAdd = null;
    let tempSplitAmount = 10000;
    
    // Override nav hook
    const prevSwitchViewPos = window.switchView;
    window.switchView = function(viewName) {
        if (typeof prevSwitchViewPos === 'function') prevSwitchViewPos(viewName);
        if (viewName === 'penjualan') {
            const mainHeader = document.getElementById('main-header');
            if (mainHeader) mainHeader.classList.add('hidden');
            window.posInitCategories();
            window.renderPosProductList();
            window.updatePosCartUI();
        }
    };

    function fmtRp(val) {
        return Number(val || 0).toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2});
    }

    // --- TOOLBAR & MAIN POS ---
    window.posToggleSearchBar = (show) => {
        document.getElementById('pos-toolbar-normal').classList.toggle('hidden', show);
        document.getElementById('pos-toolbar-search').classList.toggle('hidden', !show);
        if (show) {
            document.getElementById('pos-toolbar-barcode').classList.add('hidden');
            setTimeout(() => document.getElementById('input-pos-search').focus(), 100);
        }
    };

    window.posToggleBarcodeBar = (show) => {
        document.getElementById('pos-toolbar-normal').classList.toggle('hidden', show);
        document.getElementById('pos-toolbar-barcode').classList.toggle('hidden', !show);
        if (show) {
            document.getElementById('pos-toolbar-search').classList.add('hidden');
        }
    };

    window.posInitCategories = () => {
        const catBox = document.getElementById('container-pos-categories');
        if (!catBox || catBox.children.length > 4) return; // Prevent re-render duplicate if already exist
        // Added manually in HTML above for speed, assuming static for demo.
    };

    window.posSelectCategory = (catId) => {
        document.querySelectorAll('#container-pos-categories button[id^="btn-pos-cat-"]').forEach(b => {
            b.className = "bg-white border border-emerald-500 text-emerald-600 px-3 py-1.5 rounded-full text-[11px] font-bold hover:bg-gray-50 transition";
        });
        const activeBtn = document.getElementById(`btn-pos-cat-${catId}`);
        if (activeBtn) activeBtn.className = "bg-emerald-50 border border-emerald-500 text-emerald-600 px-3 py-1.5 rounded-full text-[11px] font-bold transition";
        window.renderPosProductList();
    };

    window.posBatalkanTransaksi = () => {
        if (confirm("Batalkan transaksi ini?")) {
            posCart = [];
            posCustomer = null;
            posBiayaNominal = 0;
            document.getElementById('dropdown-pos-main').classList.add('hidden');
            window.renderPosProductList();
            window.updatePosCartUI();
        }
    };

    window.posBukaPengaturan = () => {
        document.getElementById('dropdown-pos-main').classList.add('hidden');
        alert("Menu Pengaturan Transaksi akan membuka modul Setting Toko (Mode Optimasi, Cetak Terlewat, dll). Belum ada view HTML spesifik di scope ini.");
    };

    window.renderPosProductList = function(keyword = '') {
        const container = document.getElementById('container-pos-products');
        if (!container) return;
        container.innerHTML = '';
        const k = (keyword || '').toLowerCase();
        
        let list = (window.products || []).filter(p => (p.name || '').toLowerCase().includes(k) || (p.sku || '').toLowerCase().includes(k));
        list.sort((a, b) => a.name.localeCompare(b.name)); 

        list.forEach(p => {
            const stk = Number(p.stock) || 0;
            const initials = p.name ? p.name.trim().substring(0, 2) : 'RL';
            const priceFmt = fmtRp(p.price);
            
            // Cek apakah item ada di keranjang
            const cItems = posCart.filter(c => c.product.id === p.id);
            const selQty = cItems.reduce((s, x) => s + x.qty, 0);

            container.innerHTML += `
                <div onclick="posOpenMultiSatuanModal('${p.id}')" class="px-4 py-3 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition border-b border-gray-100">
                    <div class="flex items-center space-x-3.5 min-w-0 pr-2 flex-1">
                        <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-gray-400 font-bold text-base flex-shrink-0 shadow-inner overflow-hidden border border-gray-200">
                            ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover">` : initials}
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-bold text-sm text-gray-700 truncate">${p.name}</h4>
                            <p class="text-[11px] text-gray-500 font-medium mt-0.5">sisa ${stk} • Rp ${priceFmt}</p>
                        </div>
                    </div>
                    ${selQty > 0 ? `<div class="flex-shrink-0 w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-900 font-bold text-sm bg-white shadow-xs">${selQty}</div>` : ''}
                </div>
            `;
        });
    };

    // --- TAMBAH KE KERANJANG (MULTI SATUAN) ---
    window.posOpenMultiSatuanModal = (pid) => {
        const p = (window.products || []).find(x => x.id === pid);
        if (!p) return;
        activeProductToAdd = p;

        document.getElementById('pos-mul-name').innerText = p.name;
        document.getElementById('pos-mul-sku').innerText = p.sku || '-';
        document.getElementById('pos-mul-price').innerText = `Rp ${fmtRp(p.price)}`;
        document.getElementById('pos-mul-stock').innerText = p.stock || 0;
        document.getElementById('pos-mul-unit').innerText = p.unit || 'pcs';
        document.getElementById('pos-mul-unit-label').innerText = p.unit || 'pcs';
        
        document.getElementById('pos-mul-qty-val').innerText = '1';
        
        document.getElementById('chk-pos-mul-tempprice').checked = false;
        document.getElementById('box-pos-mul-tempprice').classList.add('hidden');
        document.getElementById('input-pos-mul-tempprice').value = p.price || 0;
        
        document.getElementById('chk-pos-mul-diskon').checked = false;
        document.getElementById('box-pos-mul-diskon').classList.add('hidden');
        document.getElementById('input-pos-mul-diskon-val').value = 0;
        
        document.getElementById('chk-pos-mul-notes').checked = false;
        document.getElementById('box-pos-mul-notes').classList.add('hidden');
        document.getElementById('input-pos-mul-notes-val').value = '';

        document.getElementById('modal-pos-multisatuan').classList.remove('hidden');
    };

    window.posAdjQty = (val) => {
        const el = document.getElementById('pos-mul-qty-val');
        let c = parseInt(el.innerText) || 0;
        c += val;
        if (c < 1) c = 1;
        el.innerText = c;
    };

    window.posAddToCart = () => {
        const q = parseInt(document.getElementById('pos-mul-qty-val').innerText) || 1;
        let prc = parseFloat(document.getElementById('input-pos-mul-tempprice').value) || activeProductToAdd.price;
        const notes = document.getElementById('chk-pos-mul-notes').checked ? document.getElementById('input-pos-mul-notes-val').value.trim() : '';
        const disc = document.getElementById('chk-pos-mul-diskon').checked ? parseFloat(document.getElementById('input-pos-mul-diskon-val').value) : 0;

        const newItem = { 
            product: activeProductToAdd, 
            qty: q, 
            sellPrice: prc, 
            discount: disc,
            notes: notes 
        };
        
        posCart.push(newItem); // Untuk POS biasanya masuk sebagai item baris terpisah jika catatan beda

        document.getElementById('modal-pos-multisatuan').classList.add('hidden');
        window.renderPosProductList(document.getElementById('input-pos-search').value);
        window.updatePosCartUI();
        
        if (!document.getElementById('view-pos-review').classList.contains('hidden')) {
            window.renderPosReviewItems();
        }
    };

    window.posApplyNoteTemplate = (txt) => {
        document.getElementById('input-pos-mul-notes-val').value = txt;
        document.getElementById('view-pos-notes-template').classList.add('hidden');
    };

    window.updatePosCartUI = () => {
        const tQty = posCart.reduce((s, x) => s + (Number(x.qty) || 0), 0);
        const lbl = document.getElementById('pos-cart-count');
        if (lbl) lbl.innerText = tQty;
    };

    // --- PELANGGAN ---
    window.posOpenInputCustomer = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pos-input-customer').classList.remove('hidden');
        posUpdateCustomerUI();
    };

    window.posOpenDaftarPelanggan = () => {
        document.getElementById('view-pos-input-customer').classList.add('hidden');
        document.getElementById('view-pos-list-customer').classList.remove('hidden');
        
        const container = document.getElementById('container-pos-cust-list');
        container.innerHTML = `
            <div onclick="posSelectCustomerDb('001 Mb Mei Ayam Sebaluh', 6046)" class="p-4 bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <div class="flex items-center space-x-3"><div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">00</div><div><span class="font-bold text-xs text-gray-900 block">001 Mb Mei Ayam Sebaluh</span><span class="text-[9px] text-gray-500">1 • gold</span></div></div>
                <span class="font-bold text-xs text-emerald-600">6046 Poin</span>
            </div>
            <div onclick="posSelectCustomerDb('004 Bu iin Sebaluh', 624)" class="p-4 bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <div class="flex items-center space-x-3"><div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">00</div><div><span class="font-bold text-xs text-gray-900 block">004 Bu iin Sebaluh</span><span class="text-[9px] text-gray-500">624</span></div></div>
                <span class="font-bold text-xs text-emerald-600">0 Poin</span>
            </div>
            <div onclick="posSelectCustomerDb('007 Dejavu Cafe', 9948)" class="p-4 bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <div class="flex items-center space-x-3"><div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">00</div><div><span class="font-bold text-xs text-gray-900 block">007 Dejavu Cafe</span><span class="text-[9px] text-gray-500">85</span></div></div>
                <span class="font-bold text-xs text-emerald-600">9948 Poin</span>
            </div>
        `;
    };

    window.posSelectCustomerDb = (name, poin) => {
        posCustomer = { name: name, poin: poin, isDb: true };
        document.getElementById('view-pos-list-customer').classList.add('hidden');
        document.getElementById('view-pos-input-customer').classList.remove('hidden');
        posUpdateCustomerUI();
    };

    window.posSaveCustomer = () => {
        const val = document.getElementById('input-pos-casual-name').value.trim();
        if (val) {
            posCustomer = { name: val, poin: 0, isDb: false };
        }
        document.getElementById('view-pos-input-customer').classList.add('hidden');
        document.getElementById('view-penjualan').classList.remove('hidden');
        
        if (posCustomer) {
            document.getElementById('pos-cust-dot').classList.remove('hidden');
        } else {
            document.getElementById('pos-cust-dot').classList.add('hidden');
        }
        
        // Update review name if it's open
        const rName = document.getElementById('pos-review-cust-name');
        if (rName) rName.innerText = posCustomer ? posCustomer.name : 'Pilih Pelanggan';
    };

    window.posClearCustomer = () => {
        posCustomer = null;
        posUpdateCustomerUI();
    };

    function posUpdateCustomerUI() {
        const btn = document.getElementById('btn-pos-pick-cust');
        const box = document.getElementById('box-pos-cust-selected');
        if (posCustomer && posCustomer.isDb) {
            btn.classList.add('hidden');
            box.classList.remove('hidden');
            document.getElementById('pos-sel-cust-name').innerText = posCustomer.name;
            document.getElementById('pos-sel-cust-poin').innerText = `${posCustomer.poin} Poin`;
        } else {
            btn.classList.remove('hidden');
            box.classList.add('hidden');
        }
    }

    // --- TUKAR POIN ---
    window.posOpenCustomerPoin = () => {
        document.getElementById('view-penjualan').classList.add('hidden');
        window.posOpenDaftarPelanggan(); 
        // Normalnya masuk ke list tapi aksi beda. Kita override sementara untuk simulasi:
        const container = document.getElementById('container-pos-cust-list');
        container.innerHTML = `
            <div onclick="posProsesTukarPoin('007 Dejavu Cafe', 9948)" class="p-4 bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50">
                <div class="flex items-center space-x-3"><div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">00</div><div><span class="font-bold text-xs text-gray-900 block">007 Dejavu Cafe</span><span class="text-[9px] text-gray-500">85</span></div></div>
                <span class="font-bold text-xs text-emerald-600">9948 Poin</span>
            </div>
        `;
    };

    window.posProsesTukarPoin = (name, poin) => {
        // Tampilkan Modal Pilihan Barang Reward (seperti di SS)
        document.getElementById('modal-pos-tukar-poin-qty').classList.remove('hidden');
    };

    window.posPoinAdjQty = (val) => {
        const el = document.getElementById('pos-poin-qty-val');
        let c = parseInt(el.innerText) || 0;
        c += val;
        if (c < 1) c = 1;
        el.innerText = c;
    };

    window.posPoinSaveQty = () => {
        document.getElementById('modal-pos-tukar-poin-qty').classList.add('hidden');
        const q = parseInt(document.getElementById('pos-poin-qty-val').innerText) || 1;
        const totalP = q * 1000;
        document.getElementById('poin-will-deduct').innerText = totalP;
        document.getElementById('poin-will-remain').innerText = 9948 - totalP;
        document.getElementById('modal-pos-tukar-poin-confirm').classList.remove('hidden');
    };

    window.posPoinCheckoutSuccess = () => {
        document.getElementById('modal-pos-tukar-poin-confirm').classList.add('hidden');
        document.getElementById('view-pos-list-customer').classList.add('hidden');
        // Pindah ke layar sukses tukar poin
        alert("Poin berhasil ditukar dengan Barang! \n(Mengarahkan ke Cetak Struk Penukaran Poin...)");
        document.getElementById('view-penjualan').classList.remove('hidden');
    };


    // --- REVIEW KERANJANG (CHECKOUT) ---
    window.posLanjutKeReview = () => {
        if (posCart.length === 0) return alert("Pilih minimal 1 barang untuk dijual!");
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pos-review').classList.remove('hidden');
        window.renderPosReviewItems();
    };

    window.renderPosReviewItems = () => {
        const container = document.getElementById('container-pos-review-items');
        container.innerHTML = '';
        let subtotal = 0;

        posCart.forEach((item, idx) => {
            let discStr = item.discount > 0 ? ` - Diskon(Rp ${item.discount})` : '';
            const itemTotal = (item.qty * item.sellPrice) - (item.discount || 0);
            subtotal += itemTotal;
            const noteStr = item.notes ? ` (${item.notes})` : '';

            container.innerHTML += `
                <div class="px-4 py-3 flex items-start space-x-3 bg-white border-b border-gray-100">
                    <span class="text-[11px] font-bold text-gray-400 mt-0.5">${idx + 1}</span>
                    <div class="flex-1 min-w-0">
                        <h4 class="font-bold text-sm text-gray-900 truncate">${item.product.name}${noteStr}</h4>
                        <p class="text-[11px] text-gray-500 font-semibold mt-0.5">${item.qty} ${item.product.unit || 'pcs'} x Rp ${fmtRp(item.sellPrice)}${discStr} = Rp ${fmtRp(itemTotal)}</p>
                    </div>
                    <button onclick="posRemoveCartItem(${idx})" class="text-red-500 text-lg hover:text-red-700 ml-2"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            `;
        });

        const gTotal = subtotal + posBiayaNominal;
        document.getElementById('pos-review-gtotal').innerText = `Rp ${fmtRp(gTotal)}`;
        document.getElementById('pos-rin-sub').innerText = `Rp ${fmtRp(subtotal)}`;
        document.getElementById('pos-rin-tot').innerText = `Rp ${fmtRp(gTotal)}`;

        const lblBiaya = document.getElementById('pos-review-biaya-label');
        if (posBiayaNominal > 0) {
            document.getElementById('pos-review-biaya-val').innerText = `Rp ${fmtRp(posBiayaNominal)}`;
            document.getElementById('pos-rin-fee').innerText = `Rp ${fmtRp(posBiayaNominal)}`;
            lblBiaya.classList.remove('hidden');
        } else {
            lblBiaya.classList.add('hidden');
        }

        const rName = document.getElementById('pos-review-cust-name');
        rName.innerText = posCustomer ? posCustomer.name : 'Pilih Pelanggan';
    };

    window.posRemoveCartItem = (idx) => {
        posCart.splice(idx, 1);
        if (posCart.length === 0) {
            document.getElementById('view-pos-review').classList.add('hidden');
            document.getElementById('view-penjualan').classList.remove('hidden');
            window.updatePosCartUI();
        } else {
            window.renderPosReviewItems();
            window.updatePosCartUI();
        }
    };

    window.posApplyBiaya = (val) => {
        posBiayaNominal = val;
        document.getElementById('modal-pos-biaya-tambahan').classList.add('hidden');
        window.renderPosReviewItems();
    };

    window.posRemoveBiaya = () => {
        posBiayaNominal = 0;
        document.getElementById('modal-pos-rincian-biaya').classList.add('hidden');
        window.renderPosReviewItems();
    };

    // --- PEMBAYARAN KASIR FINAL ---
    window.posGoToPembayaran = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pos-pembayaran').classList.remove('hidden');

        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal; 
        document.getElementById('pos-pay-gtotal-header').innerText = `Rp ${fmtRp(gTotal)}`;
        
        paymentCashAmount = 0;
        window.posRefreshCashDisplay();
        
        document.getElementById('chk-pos-pay-piutang').checked = false;
        document.getElementById('box-pos-pay-cust').innerText = posCustomer ? posCustomer.name : 'Pilih Pelanggan';
        
        // Reset Slide
        window.posSlideNumpad('left');
    };

    window.posTogglePiutang = (isPiutang) => {
        const numpad = document.getElementById('pembayaran-numpad-container');
        const display = document.getElementById('pos-pay-display-cash');
        if (isPiutang) {
            numpad.classList.add('opacity-30', 'pointer-events-none');
            display.innerText = "Rp 0";
            display.classList.remove('text-emerald-600');
            display.classList.add('text-gray-400');
            if(!posCustomer) {
                alert("Harap pilih pelanggan terlebih dahulu untuk piutang!");
                document.getElementById('chk-pos-pay-piutang').checked = false;
                window.posTogglePiutang(false);
            }
        } else {
            numpad.classList.remove('opacity-30', 'pointer-events-none');
            window.posRefreshCashDisplay();
        }
    };

    window.posSlideNumpad = (dir) => {
        const track = document.getElementById('pos-slider-track');
        const btnMan = document.getElementById('btn-pos-slide-manual');
        if (dir === 'right') { // Show Fast Cash
            track.style.transform = 'translateX(-50%)'; 
            btnMan.classList.remove('hidden');
            btnMan.classList.add('flex');
            window.renderPosFastCash();
        } else { // Show Manual
            track.style.transform = 'translateX(0)';    
            btnMan.classList.add('hidden');
            btnMan.classList.remove('flex');
        }
    };

    window.posNumpadInput = (char) => {
        if (char === 'C') {
            paymentCashAmount = 0;
        } else if (char === 'X') {
            let str = paymentCashAmount.toString();
            if (str.length > 1) {
                paymentCashAmount = parseFloat(str.slice(0, -1));
            } else {
                paymentCashAmount = 0;
            }
        } else {
            let str = paymentCashAmount === 0 ? '' : paymentCashAmount.toString();
            if(str.length < 12) {
                str += char;
                paymentCashAmount = parseFloat(str) || 0;
            }
        }
        window.posRefreshCashDisplay();
    };

    window.posSetCashAmount = (val) => {
        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal; 

        if (val === 'pas') {
            paymentCashAmount = gTotal;
        } else if (val === 'lainnya') {
            const num = prompt("Masukkan nominal tunai:");
            paymentCashAmount = parseFloat(num) || 0;
        } else {
            paymentCashAmount = val;
        }
        window.posRefreshCashDisplay();
    };

    window.posRefreshCashDisplay = () => {
        const display = document.getElementById('pos-pay-display-cash');
        const btnSubmit = document.getElementById('btn-pos-pay-submit');
        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal; 

        display.innerText = `Rp ${fmtRp(paymentCashAmount)}`;
        display.classList.add('text-emerald-600');
        display.classList.remove('text-gray-400');

        if (paymentCashAmount >= gTotal && gTotal > 0) {
            btnSubmit.className = "w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm shadow-sm cursor-pointer hover:bg-emerald-600 transition";
            btnSubmit.classList.remove('pointer-events-none');
            
            // Auto submit jika uang pas dicentang sesuai flow
            if (paymentCashAmount === gTotal) {
                setTimeout(() => window.posSelesaiTransaksi(false), 300);
            }
        } else {
            btnSubmit.className = "w-7 h-7 rounded-lg bg-gray-200 text-white flex items-center justify-center text-sm pointer-events-none transition";
        }
    };

    window.renderPosFastCash = () => {
        const box = document.getElementById('pos-fastcash-container');
        box.innerHTML = `<button onclick="posSetCashAmount('pas')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md shadow-xs transition text-sm">Uang Pas</button>`;
        const noms = [10000, 15000, 20000, 30000, 40000, 50000, 100000, 150000, 200000, 250000, 300000, 400000, 500000];
        noms.forEach(nom => {
            box.innerHTML += `<button onclick="posSetCashAmount(${nom})" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md shadow-xs transition text-sm">${fmtRp(nom)}</button>`;
        });
        box.innerHTML += `<button onclick="posSetCashAmount('lainnya')" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-md shadow-xs transition text-sm">Lainnya</button>`;
    };

    window.posSelectPaymentMethod = (method) => {
        document.getElementById('pos-pay-method-label').innerText = `Metode : ${method}`;
    };

    window.posApplyPaymentMethod = () => {
        document.getElementById('modal-pos-pilih-pay-method').classList.add('hidden');
    };

    // --- PISAH BAYAR (SPLIT PAYMENT) ---
    window.posOpenPisahBayar = () => {
        document.getElementById('modal-pos-split-select').classList.remove('hidden');
    };

    window.posConfirmSplitSelect = () => {
        document.getElementById('modal-pos-split-select').classList.add('hidden');
        document.getElementById('view-pos-pembayaran').classList.add('hidden');
        document.getElementById('view-pos-split-pay').classList.remove('hidden');
        
        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal;
        document.getElementById('pos-split-gtotal').innerText = `Rp ${fmtRp(gTotal)} `;
        
        tempSplitAmount = 10000;
        document.getElementById('input-split-1').value = tempSplitAmount;
        window.posCalcSplit();
    };

    window.posCalcSplit = () => {
        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal;
        let v1 = parseFloat(document.getElementById('input-split-1').value) || 0;
        
        if (v1 > gTotal) {
            v1 = gTotal;
            document.getElementById('input-split-1').value = v1;
        }
        document.getElementById('input-split-2').value = (gTotal - v1);
    };

    window.posClosePisahBayar = () => {
        document.getElementById('view-pos-split-pay').classList.add('hidden');
        document.getElementById('view-pos-pembayaran').classList.remove('hidden');
    };

    // --- TRANSAKSI BERHASIL & CETAK ---
    window.posSelesaiTransaksi = (isSplit = false) => {
        if(isSplit) {
            document.getElementById('modal-pos-confirm-split').classList.add('hidden');
            document.getElementById('view-pos-split-pay').classList.add('hidden');
        } else {
            document.getElementById('view-pos-pembayaran').classList.add('hidden');
        }
        document.getElementById('view-pos-success').classList.remove('hidden');

        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal;
        
        document.getElementById('pos-succ-change').innerText = `Rp ${fmtRp(Math.max(0, paymentCashAmount - gTotal))}`;
        document.getElementById('pos-succ-poin').innerText = `10 Poin`; // Simulasi
    };

    window.posKembaliKeAwal = () => {
        posCart = [];
        posCustomer = null;
        posBiayaNominal = 0;
        paymentCashAmount = 0;
        
        document.getElementById('view-pos-success').classList.add('hidden');
        document.getElementById('view-penjualan').classList.remove('hidden');
        window.renderPosProductList();
        window.updatePosCartUI();
    };

    // Cetak & Struk Navigasi
    window.posOpenPrinterSettings = () => {
        document.getElementById('view-pos-success').classList.add('hidden');
        document.getElementById('view-pos-printer').classList.remove('hidden');
    };

    window.posEditPrinter = () => {
        document.getElementById('view-pos-printer-edit').classList.remove('hidden');
    };

    window.posViewDigitalReceipt = () => {
        document.getElementById('view-pos-success').classList.add('hidden');
        document.getElementById('view-pos-struk').classList.remove('hidden');
        
        // Simulasi cetak JSON
        let contentHTML = `
            <div class="text-center font-extrabold text-[13px] uppercase mb-1 border-b border-dashed border-gray-400 pb-2">REJEKI LANCAR</div>
            <div class="text-center text-[10px] mb-3">Toko Macam Plastik<br>Jl. Bromo, PasarBaru, Pujon Lor<br>151374420261014124726</div>
            <div class="border-b border-dashed border-gray-400 pb-2 mb-2">
                <div class="flex justify-between"><p>2026-10-14</p><p>Kasir : Adm</p></div>
                <div class="flex justify-between"><p>12:47:26</p><p>004 Bu iin Sebaluh</p></div>
            </div>
            <div class="border-b border-dashed border-gray-400 pb-2 mb-2 space-y-2">
        `;
        posCart.forEach(item => {
            const itemTotal = (item.qty * item.sellPrice) - (item.discount || 0);
            const discStr = item.discount > 0 ? `<br>Diskon (Rp ${fmtRp(item.discount)}) &nbsp; Rp ${fmtRp(itemTotal)}` : `Rp ${fmtRp(itemTotal)}`;
            contentHTML += `
                <div>
                    <p class="font-bold">${item.product.name} ${item.notes ? `(${item.notes})` : ''}</p>
                    <div class="flex justify-between"><p>${item.qty} ${item.product.unit || 'pcs'} X Rp ${fmtRp(item.sellPrice)}</p><p>${discStr}</p></div>
                </div>
            `;
        });
        
        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal;
        
        contentHTML += `
            </div>
            <div class="border-b border-dashed border-gray-400 pb-2 mb-2">
                <div class="flex justify-between"><p>Sub Total</p><p>Rp ${fmtRp(subtotal)}</p></div>
                <div class="flex justify-between font-bold"><p>Biaya:</p></div>
                <div class="flex justify-between"><p>Ongkir</p><p>Rp ${fmtRp(posBiayaNominal)}</p></div>
                <div class="flex justify-between font-extrabold text-sm mt-1"><p>Total</p><p>Rp ${fmtRp(gTotal)}</p></div>
                <div class="flex justify-between mt-1"><p>Transfer</p><p>Rp 10.000</p></div>
                <div class="flex justify-between"><p>Cash</p><p>Rp 20.500</p></div>
            </div>
            <div class="border-b border-dashed border-gray-400 pb-2 mb-4 text-center">
                Poin Bertambah &nbsp;&nbsp; 10
            </div>
            <div class="text-center text-[10px] leading-relaxed">
                percobaan posisi<br>Tidak menerima pengembalian<br>barang tanpa perjanjian<br>dan struk pembelian<br>Terimakasih
            </div>
        `;
        document.getElementById('content-pos-struk-digital').innerHTML = contentHTML;
    };

    window.posOpenRincianJson = () => {
        document.getElementById('view-pos-struk').classList.add('hidden');
        document.getElementById('view-pos-rincian-json').classList.remove('hidden');
        document.getElementById('pos-content-rincian-json').innerText = "{\n  \"data_transaksi\": [\n    {\n      \"nama_barang\": \"Sndk Bebek Hitam\",\n      \"kode_barang\": \"176\",\n      \"banyak_barang\": 1,\n      \"harga_jual\": 5000\n    }\n  ]\n}";
    };

})();
