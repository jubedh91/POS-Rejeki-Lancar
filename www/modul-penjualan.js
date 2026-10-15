// ============================================================================
// MODUL 14: TRANSAKSI PENJUALAN (POS UTAMA) - KLASIK & FIX LOGIC
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
                        <span id="pos-draft-badge-count">13</span><i class="fa-solid fa-bell"></i>
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
                    <input type="checkbox" id="chk-pos-search-code" class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                    <span>Kode</span>
                </label>
                <button onclick="document.getElementById('input-pos-search').value=''; renderPosProductList('');" class="text-red-500 text-xs font-bold px-1">Hapus</button>
                <button onclick="posToggleSearchBar(false)" class="text-emerald-700 text-xl px-1"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <!-- Baris Alat (Barcode Input Mode) -->
            <div class="px-3 py-2 bg-white border-b relative z-20 h-14 flex items-center hidden space-x-2" id="pos-toolbar-barcode">
                <div class="relative flex-1">
                    <input type="text" id="input-pos-barcode-fast" onkeydown="handlePosFastBarcode(event)" placeholder="Ketik barcode lalu enter" class="w-full pl-3 pr-4 py-2 border-b-2 border-emerald-600 text-xs font-bold text-emerald-700 focus:outline-none bg-transparent">
                </div>
                <button onclick="posToggleBarcodeBar(false)" class="text-emerald-700 text-xl px-2"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <!-- Kategori Scroll -->
            <div class="bg-white border-b py-2 px-3 overflow-x-auto whitespace-nowrap hide-scrollbar flex space-x-2 items-center" id="container-pos-categories">
                <!-- Disuntik via JS -->
            </div>

            <!-- Daftar Produk -->
            <div class="flex-1 overflow-y-auto pb-24 bg-white divide-y divide-gray-100" id="container-pos-products" onclick="document.getElementById('dropdown-pos-main').classList.add('hidden')"></div>

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
                    <button id="btn-pos-pick-cust" onclick="posOpenDaftarPelanggan()" class="w-full bg-white border border-emerald-600 text-emerald-600 font-bold py-3 rounded-lg text-xs hover:bg-emerald-50 transition">
                        Klik untuk menambahkan pelanggan
                    </button>
                    
                    <div id="box-pos-cust-selected" class="hidden relative border-b border-gray-200 pb-3 mb-2">
                        <div class="flex items-center space-x-3">
                            <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm" id="pos-sel-cust-av">AB</div>
                            <div>
                                <span class="font-bold text-sm text-gray-900 block" id="pos-sel-cust-name">-</span>
                                <span class="text-[10px] text-gray-500 font-semibold block" id="pos-sel-cust-phone">-</span>
                                <span class="text-emerald-600 font-bold text-xs mt-1 block flex items-center"><i class="fa-regular fa-star mr-1"></i> <span id="pos-sel-cust-poin">0 Poin</span></span>
                            </div>
                        </div>
                        <button onclick="posClearCustomer()" class="absolute top-0 right-0 text-gray-400 hover:text-red-500 text-2xl"><i class="fa-solid fa-xmark"></i></button>
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

        <!-- DAFTAR PELANGGAN -->
        <div id="view-pos-list-customer" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-50">
            <div class="px-4 py-3 bg-white flex items-center space-x-3 shadow-sm z-10 border-b">
                <button onclick="document.getElementById('view-pos-list-customer').classList.add('hidden'); document.getElementById('view-pos-input-customer').classList.remove('hidden');" class="text-emerald-700 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                <h2 class="text-base font-bold text-emerald-700">Pilih Pelanggan</h2>
            </div>
            <div class="p-3 bg-white border-b flex items-center space-x-2">
                <button class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" oninput="renderPosCustomerList(this.value)" placeholder="Nama, email atau no telp" class="w-full pl-10 pr-4 py-2.5 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none">
                </div>
            </div>
            <div class="flex-1 overflow-y-auto pb-24 divide-y divide-gray-100" id="container-pos-cust-list"></div>
        </div>

        <!-- === 3. HALAMAN REVIEW (KERANJANG CHECKOUT) === -->
        <div id="view-pos-review" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative z-30">
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

            <!-- Tab Biaya Tambahan -->
            <div class="px-4 py-2 bg-white flex justify-end border-b border-gray-100 relative z-10">
                <button onclick="document.getElementById('modal-pos-biaya-tambahan').classList.remove('hidden')" class="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center space-x-1"><i class="fa-solid fa-plus"></i><span>Biaya</span></button>
            </div>
            <div id="pos-review-biaya-label" class="hidden px-4 py-2 bg-white border-b border-gray-100 flex justify-between items-center text-[10px] font-bold text-gray-600 cursor-pointer hover:bg-gray-50" onclick="document.getElementById('modal-pos-rincian-biaya').classList.remove('hidden')">
                <span id="pos-review-disp-disc">Diskon : -</span>
                <span id="pos-review-disp-tax">Pajak : -</span>
                <span>BIAYA : <span id="pos-review-biaya-val">Rp 0</span> <i class="fa-solid fa-chevron-down text-emerald-600"></i></span>
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
        <div id="view-pos-pembayaran" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white flex justify-between items-center z-20 border-b shadow-sm">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-pos-pembayaran').classList.add('hidden'); document.getElementById('view-pos-review').classList.remove('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Pembayaran</h2>
                </div>
                <div class="flex items-center space-x-2">
                    <h2 class="text-base font-extrabold text-gray-900" id="pos-pay-gtotal-header">Rp 0</h2>
                    <button id="btn-pos-pay-submit" onclick="posSelesaiTransaksi(false)" class="w-7 h-7 rounded-lg bg-gray-200 text-white flex items-center justify-center text-sm transition pointer-events-none">
                        <i class="fa-solid fa-check"></i>
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 pb-4 flex flex-col">
                <div class="flex justify-between items-center py-2">
                    <button class="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-3 py-1.5 rounded-md flex items-center space-x-1 border border-emerald-100"><i class="fa-solid fa-star"></i><span id="pos-pay-poin">+0 Poin</span></button>
                    <button onclick="posOpenPisahBayar()" class="bg-emerald-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-sm"><i class="fa-solid fa-right-left"></i><span>Pisah Bayar</span></button>
                </div>
                
                <h1 class="text-3xl font-extrabold text-gray-400 text-center py-2 pb-4 transition-colors duration-300" id="pos-pay-display-cash">Rp 0</h1>

                <div class="flex items-center space-x-3 mb-3">
                    <label class="flex items-center space-x-2 cursor-pointer text-xs font-bold text-gray-900 bg-gray-50 border border-gray-200 p-3 rounded-lg">
                        <input type="checkbox" id="chk-pos-pay-piutang" onchange="posTogglePiutang(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span>Piutang</span>
                    </label>
                    <div onclick="posOpenInputCustomer()" class="flex-1 bg-white border border-emerald-600 rounded-lg p-3 text-xs font-bold text-emerald-700 cursor-pointer truncate shadow-sm" id="box-pos-pay-cust">Pilih Pelanggan</div>
                    <div onclick="document.getElementById('modal-pos-no-meja').classList.remove('hidden')" class="w-24 bg-white border border-gray-300 rounded-lg p-3 text-xs font-bold text-gray-500 cursor-pointer text-center shadow-sm">No. Meja</div>
                </div>

                <div class="mb-3">
                    <input type="text" id="input-pos-pay-notes" placeholder="Keterangan Struk" class="w-full bg-gray-50 rounded-lg p-3 text-xs font-bold text-gray-900 focus:outline-none border border-gray-200 focus:border-emerald-500">
                </div>

                <div class="flex space-x-2 mb-3 text-[10px] font-bold text-gray-600">
                    <div class="flex-1 border border-gray-300 rounded-lg p-2.5 flex justify-center items-center bg-gray-50" id="label-pay-diskon-bot">Diskon : 0%</div>
                    <div class="flex-1 border border-gray-300 rounded-lg p-2.5 flex justify-center items-center bg-gray-50" id="label-pay-pajak-bot">Pajak : 0%</div>
                    <div class="flex-1 relative cursor-pointer" onclick="document.getElementById('modal-pos-pilih-pay-method').classList.remove('hidden')">
                        <div class="border border-gray-900 rounded-lg p-2.5 flex justify-between items-center text-gray-900 bg-white">
                            <span id="pos-pay-method-label">Metode : Cash</span><i class="fa-solid fa-chevron-down"></i>
                        </div>
                    </div>
                </div>

                <!-- Fix Numpad Date to Native DateTime Local -->
                <div class="mb-4">
                    <label class="block text-[10px] text-gray-500 font-bold mb-1 ml-1">Waktu Transaksi</label>
                    <input type="datetime-local" id="input-pos-pay-date" class="w-full border border-gray-300 rounded-lg p-3 text-xs font-bold text-gray-900 bg-white focus:outline-none focus:border-emerald-600 shadow-sm">
                </div>

                <button id="btn-pos-slide-manual" onclick="posSlideNumpad('left')" class="w-full bg-white border border-emerald-600 text-emerald-700 font-bold py-3 rounded-t-xl shadow-sm text-xs items-center justify-between px-4 hidden transition mb-2">
                    <div class="flex items-center space-x-2"><i class="fa-regular fa-keyboard text-lg"></i><span>Ketik Nominal Manual</span></div>
                    <i class="fa-solid fa-chevron-right"></i>
                </button>

                <!-- SLIDER NUMPAD -->
                <div class="flex-1 relative overflow-hidden mt-1 bg-gray-50 rounded-2xl p-2 pb-0 border border-gray-100 shadow-inner">
                    <div id="pos-slider-track" class="absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-300 ease-in-out pb-4">
                        
                        <!-- Panel Kiri: Numpad Manual -->
                        <div class="w-1/2 h-full px-2">
                            <div class="grid grid-cols-4 gap-2 h-full">
                                <button onclick="posNumpadInput('7')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">7</button>
                                <button onclick="posNumpadInput('8')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">8</button>
                                <button onclick="posNumpadInput('9')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">9</button>
                                <button onclick="posNumpadInput('C')" class="bg-gray-200 rounded-xl shadow-xs text-xl font-bold text-gray-600 active:bg-gray-300">C</button>
                                
                                <button onclick="posNumpadInput('4')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">4</button>
                                <button onclick="posNumpadInput('5')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">5</button>
                                <button onclick="posNumpadInput('6')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">6</button>
                                <button onclick="posNumpadInput('X')" class="bg-gray-100 rounded-xl shadow-xs text-xl font-bold text-emerald-700 active:bg-gray-200"><i class="fa-solid fa-delete-left"></i></button>
                                
                                <button onclick="posNumpadInput('1')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">1</button>
                                <button onclick="posNumpadInput('2')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">2</button>
                                <button onclick="posNumpadInput('3')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">3</button>
                                <button onclick="posSlideNumpad('right')" class="bg-emerald-100 border border-emerald-300 rounded-xl shadow-xs flex flex-col justify-center items-center text-emerald-700 active:bg-emerald-200 row-span-2">
                                    <span class="text-[11px] font-bold mb-1 border-b border-emerald-300 pb-1">Auto</span><i class="fa-solid fa-money-bill-wave text-2xl"></i>
                                </button>
                                
                                <button onclick="posNumpadInput('0')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">0</button>
                                <button onclick="posNumpadInput('000')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">000</button>
                                <button onclick="posNumpadInput('.')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">.</button>
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

        <!-- === 5. HALAMAN PISAH BAYAR === -->
        <div id="view-pos-split-pay" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative z-50">
            <div class="px-4 py-3 bg-white border-b flex justify-between items-center shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="posClosePisahBayar()" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-extrabold text-gray-900" id="pos-split-gtotal">Rp 0</h2>
                </div>
                <button onclick="posClosePisahBayar()" class="text-red-500 text-xs font-bold px-2 py-1"><i class="fa-solid fa-xmark"></i> Batal</button>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                    <div class="flex items-center space-x-3 mb-2"><span class="font-extrabold text-xs text-gray-900">Pembayaran 1</span><span class="bg-gray-200 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase" id="pos-split-m1">TRANSFER</span></div>
                    <input type="number" id="input-split-1" oninput="posCalcSplit()" value="0" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                </div>
                <div>
                    <div class="flex items-center space-x-3 mb-2"><span class="font-extrabold text-xs text-gray-900">Pembayaran 2</span><span class="bg-gray-200 text-emerald-700 text-[9px] font-bold px-2 py-0.5 rounded uppercase" id="pos-split-m2">CASH</span></div>
                    <input type="number" id="input-split-2" readonly value="0" class="w-full border border-gray-300 rounded-full p-3 px-4 text-xs font-bold text-gray-900 bg-gray-50 focus:outline-none">
                </div>
            </div>
            <div class="p-4 bg-white border-t absolute bottom-0 left-0 right-0 z-10">
                <button onclick="document.getElementById('modal-pos-confirm-split').classList.remove('hidden')" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition text-xs uppercase">SELESAIKAN TRANSAKSI</button>
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
                    <div class="w-full space-y-3 text-xs font-semibold text-gray-600 mb-4 px-2 border-b border-gray-200 pb-4">
                        <div class="flex justify-between items-center"><span>Total</span><span class="text-gray-900 font-extrabold" id="pos-succ-total">Rp 0</span></div>
                        <div class="flex justify-between items-center"><span>Kembalian</span><span class="text-gray-900 font-bold" id="pos-succ-change">Rp 0</span></div>
                        <div class="flex justify-between items-center"><span>Poin di dapat</span><span class="text-emerald-600 font-bold flex items-center"><i class="fa-regular fa-star mr-1"></i> <span id="pos-succ-poin">0 Poin</span></span></div>
                    </div>
                    <div class="w-full space-y-2 text-xs font-extrabold text-gray-900">
                        <button onclick="document.getElementById('modal-pos-do-print').classList.remove('hidden')" class="w-full flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50"><span>Cetak Struk Lengkap</span><i class="fa-solid fa-chevron-right text-gray-400"></i></button>
                        <button onclick="posViewDigitalReceipt()" class="w-full flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 text-emerald-700"><span>Lihat Struk Digital</span><i class="fa-solid fa-chevron-right"></i></button>
                    </div>
                </div>
            </div>
            <div class="p-4 w-full">
                <button onclick="posKembaliKeAwal()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SELESAI</button>
            </div>
        </div>

        <!-- === 7. STRUK DIGITAL PENJUALAN === -->
        <div id="view-pos-struk" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-emerald-500 hidden relative z-50">
            <div class="px-4 py-3 flex justify-between items-center text-white z-10">
                <button onclick="document.getElementById('view-pos-struk').classList.add('hidden'); document.getElementById('view-pos-success').classList.remove('hidden');" class="text-xl font-bold p-1"><i class="fa-solid fa-arrow-left"></i></button>
                <h2 class="text-base font-bold uppercase tracking-wider">STRUK</h2>
                <div class="flex space-x-3 text-xl">
                    <button onclick="alert('Mengunduh Struk...')"><i class="fa-solid fa-download"></i></button>
                    <button onclick="document.getElementById('modal-pos-share').classList.remove('hidden')"><i class="fa-solid fa-share-nodes"></i></button>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4 flex justify-center pb-12">
                <div class="bg-white w-full max-w-sm p-6 relative font-mono text-[11px] text-gray-900 shadow-xl" style="background-image: radial-gradient(circle at 10px 0, transparent 10px, white 11px), radial-gradient(circle at 10px 100%, transparent 10px, white 11px); background-size: 20px 100%; background-repeat: repeat-x;">
                    <div class="absolute top-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDEwLDAgMjAsMTAiIGZpbGw9IiNlY2ZjZjciLz48L3N2Zz4=')]"></div>
                    <div id="content-pos-struk-digital" class="pt-2"></div>
                    <div class="absolute bottom-0 left-0 w-full h-2 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAgMTAsMTAgMjAsMCIgZmlsbD0iI2VjZmNmNyIvPjwvc3ZnPg==')] transform rotate-180"></div>
                </div>
            </div>
        </div>
    `;

    // 2. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <div id="modal-pos-add-temp" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-xs overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">TRANSAKSI TAMBAHAN</h3>
                <div class="space-y-3 mb-4 text-xs font-bold text-gray-900">
                    <input type="text" id="pos-add-temp-name" placeholder="Barang atau jasa" class="w-full border border-emerald-600 rounded-full p-3 px-4 focus:outline-none">
                    <input type="number" id="pos-add-temp-sell" placeholder="Harga jual" class="w-full border border-emerald-600 rounded-full p-3 px-4 focus:outline-none" pattern="[0-9]*" inputmode="numeric">
                    <div class="flex justify-center items-center space-x-8 py-2 text-xl border border-gray-200 rounded-full w-3/4 mx-auto">
                        <button onclick="posTempAdjQty(-1)" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-minus"></i></button>
                        <span id="pos-temp-qty-val">1</span>
                        <button onclick="posTempAdjQty(1)" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 py-3 rounded-full font-extrabold text-xs uppercase">BATAL</button>
                    <button onclick="posAddTempItemToCart()" type="button" class="bg-emerald-600 text-white py-3 rounded-full font-extrabold text-xs uppercase shadow-md">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-biaya-tambahan" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center">MODUL BIAYA</h3>
                <div class="space-y-4 text-xs font-semibold text-gray-600">
                    <div><label class="block mb-1">Nama Biaya</label><input type="text" id="input-pos-rin-biaya-name" placeholder="Ongkir" class="w-full border border-gray-300 rounded-full p-3.5 px-4 font-bold text-gray-900 focus:outline-none"></div>
                    <div>
                        <label class="block mb-1">Nominal</label>
                        <div class="flex border border-gray-300 rounded-full overflow-hidden focus-within:border-emerald-600">
                            <div class="bg-emerald-50 text-emerald-700 font-bold px-4 flex items-center justify-center border-r border-gray-300">Rp</div>
                            <input type="number" id="input-pos-rin-biaya-val" placeholder="0" class="flex-1 p-3.5 px-3 font-bold text-gray-900 focus:outline-none">
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-6">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase">BATAL</button>
                    <button onclick="posApplyBiayaCustom()" type="button" class="bg-emerald-600 text-white py-3.5 rounded-full font-extrabold text-xs uppercase">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-pilih-pay-method" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">PILIH PEMBAYARAN</h3>
                <div class="grid grid-cols-2 gap-3 mb-6">
                    <button onclick="posSelectPaymentMethod('Cash')" class="w-full bg-white border border-gray-300 text-gray-900 font-bold py-4 rounded-xl shadow-xs text-xs hover:bg-emerald-50 transition">Cash</button>
                    <button onclick="posSelectPaymentMethod('Transfer')" class="w-full bg-emerald-100/50 border border-emerald-500 text-emerald-700 font-bold py-4 rounded-xl shadow-xs text-xs transition">Transfer</button>
                    <button onclick="posSelectPaymentMethod('QRIS')" class="w-full bg-white border border-gray-300 text-gray-900 font-bold py-4 rounded-xl shadow-xs text-xs hover:bg-emerald-50 transition">QRIS</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-split-select" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">PILIH 2 PEMBAYARAN</h3>
                <div class="grid grid-cols-2 gap-3 mb-6 font-bold text-xs">
                    <button onclick="posToggleSplitMethod(this, 'Cash')" class="w-full bg-emerald-50 border border-emerald-500 text-emerald-700 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2"><i class="fa-solid fa-circle-check"></i><span>Cash</span></button>
                    <button onclick="posToggleSplitMethod(this, 'Transfer')" class="w-full bg-emerald-50 border border-emerald-500 text-emerald-700 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2"><i class="fa-solid fa-circle-check"></i><span>Transfer</span></button>
                    <button onclick="posToggleSplitMethod(this, 'QRIS')" class="w-full bg-white border border-gray-300 text-gray-400 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2"><i class="fa-regular fa-circle-check"></i><span>QRIS</span></button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 py-3.5 rounded-full font-extrabold text-xs uppercase">BATAL</button>
                    <button onclick="posConfirmSplitSelect()" type="button" class="bg-emerald-600 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md">SET</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-confirm-split" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6 text-center space-y-4">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-2">KONFIRMASI</h3>
                <div class="w-12 h-12 rounded-full border-2 border-emerald-600 text-emerald-600 flex items-center justify-center text-2xl font-bold mx-auto mt-2">!</div>
                <p class="text-xs font-bold text-gray-600 pb-2">Apakah Anda yakin ingin menyelesaikan transaksi?</p>
                <div class="grid grid-cols-2 gap-3 pt-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase">BATAL</button>
                    <button onclick="posSelesaiTransaksi(true)" type="button" class="bg-emerald-600 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md">SELESAI</button>
                </div>
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
    let posDiskonGlobal = 0;
    let posPajakGlobal = 0;
    let paymentCashAmount = 0;
    let posSplitMethods = ['Cash', 'Transfer'];

    const prevSwitchViewPos = window.switchView;
    window.switchView = function(viewName) {
        if (typeof prevSwitchViewPos === 'function') prevSwitchViewPos(viewName);
        if (viewName === 'penjualan') {
            const mainHeader = document.getElementById('main-header');
            if (mainHeader) mainHeader.classList.add('hidden');
            window.posInitCategories();
            window.renderPosProductList('');
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
        if(show) { document.getElementById('pos-toolbar-barcode').classList.add('hidden'); setTimeout(() => document.getElementById('input-pos-search').focus(), 100); }
    };
    window.posToggleBarcodeBar = (show) => {
        document.getElementById('pos-toolbar-normal').classList.toggle('hidden', show);
        document.getElementById('pos-toolbar-barcode').classList.toggle('hidden', !show);
        if(show) { document.getElementById('pos-toolbar-search').classList.add('hidden'); setTimeout(() => document.getElementById('input-pos-barcode-fast').focus(), 100); }
    };

    window.handlePosFastBarcode = (e) => {
        if(e.key === 'Enter') {
            const code = e.target.value.trim().toLowerCase();
            if(!code) return;
            const found = (window.products || []).find(p => (p.sku || '').toLowerCase() === code || (p.name || '').toLowerCase() === code);
            if(found) {
                posCart.push({ product: found, qty: 1, sellPrice: found.price || 0, isManual: false });
                window.renderPosProductList(document.getElementById('input-pos-search').value);
                window.updatePosCartUI();
            } else { alert("Barang tidak ditemukan!"); }
            e.target.value = '';
        }
    };

    window.posInitCategories = () => {
        const catBox = document.getElementById('container-pos-categories');
        if (!catBox || catBox.children.length > 4) return;
        let cats = ["Semua"];
        (window.products || []).forEach(p => {
            const c = p.category && p.category.trim() !== '' ? p.category.trim() : 'Umum';
            if (!cats.includes(c)) cats.push(c);
        });
        let html = `<button onclick="document.getElementById('modal-pos-filter').classList.remove('hidden')" class="text-emerald-700 text-lg px-2"><i class="fa-solid fa-arrow-up-wide-short"></i></button>`;
        cats.forEach((c, idx) => {
            const cls = idx === 0 
                ? 'bg-emerald-50 border border-emerald-500 text-emerald-600 font-bold rounded-full px-3 py-1.5 transition text-[11px]' 
                : 'bg-white text-emerald-600 border-emerald-500 font-bold rounded-full px-3 py-1.5 border hover:bg-emerald-50 transition text-[11px]';
            html += `<button onclick="posSelectCategory('${c}')" id="btn-pos-cat-${c.replace(/\s+/g, '-')}" class="${cls}">${c}</button>`;
        });
        catBox.innerHTML = html;
    };

    window.posSelectCategory = (cat) => {
        document.querySelectorAll('#container-pos-categories button[id^="btn-pos-cat-"]').forEach(b => {
            b.className = "bg-white text-emerald-600 border-emerald-500 font-bold rounded-full px-3 py-1.5 border hover:bg-emerald-50 transition text-[11px]";
        });
        const activeBtn = document.getElementById(`btn-pos-cat-${cat.replace(/\s+/g, '-')}`);
        if (activeBtn) activeBtn.className = "bg-emerald-50 border border-emerald-500 text-emerald-600 font-bold rounded-full px-3 py-1.5 transition text-[11px]";
        
        const k = document.getElementById('input-pos-search').value.toLowerCase();
        let list = window.products || [];
        if(cat !== 'Semua') list = list.filter(p => (p.category || 'Umum') === cat);
        if(k) list = list.filter(p => (p.name || '').toLowerCase().includes(k) || (p.sku || '').toLowerCase().includes(k));
        renderPosCardItems(list);
    };

    window.renderPosProductList = function(keyword = '') {
        const k = keyword.toLowerCase();
        const isCode = document.getElementById('chk-pos-search-code')?.checked;
        let list = window.products || [];
        if(k) {
            list = list.filter(p => {
                if(isCode) return (p.sku || '').toLowerCase().includes(k);
                return (p.name || '').toLowerCase().includes(k) || (p.sku || '').toLowerCase().includes(k);
            });
        }
        renderPosCardItems(list);
    };

    function renderPosCardItems(list) {
        const container = document.getElementById('container-pos-products');
        if (!container) return;
        container.innerHTML = '';
        if(list.length === 0) {
            container.innerHTML = `<div class="p-8 text-center text-xs font-semibold text-gray-400">Barang tidak ditemukan.</div>`;
            return;
        }

        list.sort((a, b) => a.name.localeCompare(b.name)).forEach(p => {
            const stk = Number(p.stock) || 0;
            const sColor = stk <= 0 ? 'text-red-500' : 'text-emerald-600';
            const initials = p.name ? p.name.trim().substring(0, 2).toUpperCase() : 'RL';
            const selQty = posCart.filter(c => c.product.id === p.id).reduce((s, x) => s + x.qty, 0);
            const badgeQty = selQty > 0 ? `<div class="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-900 font-extrabold text-sm bg-white shadow-xs ml-3">${selQty}</div>` : '';

            container.innerHTML += `
                <div onclick="posQuickAddToCart('${p.id}')" class="px-4 py-3 bg-white flex items-center justify-between hover:bg-emerald-50/50 cursor-pointer transition">
                    <div class="flex items-start space-x-3.5 flex-1 min-w-0 pr-2">
                        <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-extrabold text-lg flex-shrink-0 shadow-inner border border-gray-200 overflow-hidden">
                            ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover">` : initials}
                        </div>
                        <div class="min-w-0 pt-0.5">
                            <h4 class="font-extrabold text-[13px] text-gray-700 truncate">${p.name}</h4>
                            <p class="text-[10px] text-gray-500 font-semibold mt-0.5">sisa <span class="${sColor}">${stk}</span> <span class="mx-1">•</span> Rp ${fmtRp(p.price)}</p>
                        </div>
                    </div>
                    ${badgeQty}
                </div>
            `;
        });
    }

    // --- TAMBAH KE KERANJANG & TEMP ITEM ---
    window.posQuickAddToCart = (pid) => {
        const p = (window.products || []).find(x => x.id === pid);
        if (!p) return;
        if (p.useStock !== false && p.stock <= 0) return alert("Stok barang habis!");

        const existingIdx = posCart.findIndex(c => c.product.id === pid);
        if(existingIdx >= 0) {
            if (p.useStock !== false && posCart[existingIdx].qty >= p.stock) return alert("Mencapai batas maksimal stok fisik!");
            posCart[existingIdx].qty++;
        } else {
            posCart.push({ product: p, qty: 1, sellPrice: p.price || 0, isManual: false });
        }
        window.renderPosProductList(document.getElementById('input-pos-search').value);
        window.updatePosCartUI();
    };

    window.posTempAdjQty = (val) => {
        const el = document.getElementById('pos-temp-qty-val');
        let c = parseInt(el.innerText) || 0;
        c += val;
        if (c < 1) c = 1;
        el.innerText = c;
    };

    window.posAddTempItemToCart = () => {
        const name = document.getElementById('pos-add-temp-name').value.trim();
        const sell = parseFloat(document.getElementById('pos-add-temp-sell').value) || 0;
        const qty = parseInt(document.getElementById('pos-temp-qty-val').innerText) || 1;

        if(!name || sell <= 0) return alert("Nama dan Harga Jual wajib diisi!");

        const tempProd = { id: 'manual_' + Date.now(), name: name, price: sell, stock: 999, useStock: false, unit: 'pcs' };
        posCart.push({ product: tempProd, qty: qty, sellPrice: sell, isManual: true });

        document.getElementById('modal-pos-add-temp').classList.add('hidden');
        window.updatePosCartUI();
    };

    window.updatePosCartUI = () => {
        const tQty = posCart.reduce((s, x) => s + (Number(x.qty) || 0), 0);
        const lbl = document.getElementById('pos-cart-count');
        if (lbl) lbl.innerText = tQty;
    };

    window.posBatalkanTransaksi = () => {
        if(confirm("Batalkan transaksi dan reset keranjang?")) {
            posCart = [];
            posCustomer = null;
            posBiayaNominal = 0;
            document.getElementById('dropdown-pos-main').classList.add('hidden');
            window.renderPosProductList('');
            window.updatePosCartUI();
        }
    };

    // --- PELANGGAN ---
    window.posOpenInputCustomer = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pos-input-customer').classList.remove('hidden');
    };
    window.posOpenDaftarPelanggan = () => {
        document.getElementById('view-pos-input-customer').classList.add('hidden');
        document.getElementById('view-pos-list-customer').classList.remove('hidden');
        window.renderPosCustomerList('');
    };
    window.renderPosCustomerList = (keyword = '') => {
        const container = document.getElementById('container-pos-cust-list');
        container.innerHTML = '';
        const k = keyword.toLowerCase();
        let list = (window.customersList || []).filter(c => c.name.toLowerCase().includes(k) || (c.phone||'').includes(k));
        list.forEach(c => {
            container.innerHTML += `
                <div onclick="posSelectCustomerDb('${c.name}', ${c.points || 0})" class="p-4 bg-white flex justify-between items-center cursor-pointer hover:bg-gray-50">
                    <div class="flex items-center space-x-3"><div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">${c.avatarCode||'00'}</div><div><span class="font-bold text-xs text-gray-900 block">${c.name}</span><span class="text-[9px] text-gray-500">${c.phone||'-'}</span></div></div>
                    <span class="font-bold text-xs text-emerald-600">${c.points || 0} Poin</span>
                </div>
            `;
        });
    };
    window.posSelectCustomerDb = (name, poin) => {
        posCustomer = { name: name, poin: poin, isDb: true };
        document.getElementById('view-pos-list-customer').classList.add('hidden');
        document.getElementById('view-pos-input-customer').classList.remove('hidden');
        document.getElementById('btn-pos-pick-cust').classList.add('hidden');
        document.getElementById('box-pos-cust-selected').classList.remove('hidden');
        document.getElementById('pos-sel-cust-name').innerText = name;
        document.getElementById('pos-sel-cust-poin').innerText = `${poin} Poin`;
    };
    window.posSaveCustomer = () => {
        const val = document.getElementById('input-pos-casual-name').value.trim();
        if (val) posCustomer = { name: val, poin: 0, isDb: false };
        document.getElementById('view-pos-input-customer').classList.add('hidden');
        document.getElementById('view-penjualan').classList.remove('hidden');
        document.getElementById('pos-cust-dot').classList.toggle('hidden', !posCustomer);
        const rName = document.getElementById('pos-review-cust-name');
        if (rName) rName.innerText = posCustomer ? posCustomer.name : 'Pilih Pelanggan';
    };
    window.posClearCustomer = () => {
        posCustomer = null;
        document.getElementById('btn-pos-pick-cust').classList.remove('hidden');
        document.getElementById('box-pos-cust-selected').classList.add('hidden');
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
            const itemTotal = item.qty * item.sellPrice;
            subtotal += itemTotal;
            container.innerHTML += `
                <div class="px-4 py-3.5 flex items-start space-x-3 bg-white hover:bg-gray-50 transition border-b border-gray-50">
                    <span class="text-[11px] font-bold text-gray-400 mt-0.5 w-4">${idx + 1}</span>
                    <div class="flex-1 min-w-0 space-y-0.5">
                        <h4 class="font-extrabold text-xs text-gray-900 truncate">${item.product.name}</h4>
                        <p class="text-[11px] text-gray-500 font-semibold">${item.qty} ${item.product.unit || 'pcs'} x Rp ${fmtRp(item.sellPrice)} = <span class="text-gray-900 font-bold">Rp ${fmtRp(itemTotal)}</span></p>
                    </div>
                    <button onclick="posRemoveCartItem(${idx})" class="text-red-500 hover:text-red-700 text-lg p-1 transition"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            `;
        });

        const gTotal = subtotal + posBiayaNominal;
        document.getElementById('pos-review-gtotal').innerText = `Rp ${fmtRp(gTotal)}`;

        const lblBiaya = document.getElementById('pos-review-biaya-label');
        if (posBiayaNominal > 0) {
            document.getElementById('pos-review-biaya-val').innerText = `Rp ${fmtRp(posBiayaNominal)}`;
            lblBiaya.classList.remove('hidden');
            lblBiaya.classList.add('flex');
        } else {
            lblBiaya.classList.add('hidden');
            lblBiaya.classList.remove('flex');
        }

        const rName = document.getElementById('pos-review-cust-name');
        if(rName) rName.innerText = posCustomer ? posCustomer.name : 'Pilih Pelanggan';
    };

    window.posRemoveCartItem = (idx) => {
        posCart.splice(idx, 1);
        if (posCart.length === 0) {
            document.getElementById('view-pos-review').classList.add('hidden');
            document.getElementById('view-penjualan').classList.remove('hidden');
            window.updatePosCartUI();
            window.renderPosProductList(document.getElementById('input-pos-search').value);
        } else {
            window.renderPosReviewItems();
            window.updatePosCartUI();
        }
    };

    window.posApplyBiayaCustom = () => {
        const v = parseFloat(document.getElementById('input-pos-rin-biaya-val').value) || 0;
        posBiayaNominal = v;
        document.getElementById('modal-pos-biaya-tambahan').classList.add('hidden');
        window.renderPosReviewItems();
    };

    // --- PEMBAYARAN KASIR FINAL ---
    window.posGoToPembayaran = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pos-pembayaran').classList.remove('hidden');

        let subtotal = posCart.reduce((s, x) => s + (x.qty * x.sellPrice), 0);
        let gTotal = subtotal + posBiayaNominal; 
        document.getElementById('pos-pay-gtotal-header').innerText = `Rp ${fmtRp(gTotal)}`;
        
        // Atur Tanggal Otomatis (Format datetime-local)
        try {
            const now = new Date();
            const offset = now.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
            document.getElementById('input-pos-pay-date').value = localISOTime;
        } catch(e) {}
        
        paymentCashAmount = 0;
        window.posRefreshCashDisplay();
        document.getElementById('chk-pos-pay-piutang').checked = false;
        
        // Render Numpad Cepat
        const box = document.getElementById('pos-fastcash-container');
        box.innerHTML = `<button onclick="posSetCashAmount(${gTotal})" class="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-md shadow-xs text-sm active:bg-emerald-700">Uang Pas</button>`;
        [10000, 20000, 50000, 100000, 200000].forEach(nom => {
            box.innerHTML += `<button onclick="posSetCashAmount(${nom})" class="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-md shadow-xs text-sm active:bg-emerald-700">${fmtRp(nom)}</button>`;
        });
        
        window.posSlideNumpad('left');
    };

    window.posSlideNumpad = (dir) => {
        const track = document.getElementById('pos-slider-track');
        const btnMan = document.getElementById('btn-pos-slide-manual');
        if (dir === 'right') { 
            track.style.transform = 'translateX(-50%)'; 
            btnMan.classList.remove('hidden');
            btnMan.classList.add('flex');
        } else { 
            track.style.transform = 'translateX(0)';    
            btnMan.classList.add('hidden');
            btnMan.classList.remove('flex');
        }
    };

    window.posNumpadInput = (char) => {
        if (char === 'C') paymentCashAmount = 0;
        else if (char === 'X') {
            let str = paymentCashAmount.toString();
            paymentCashAmount = str.length > 1 ? parseFloat(str.slice(0, -1)) : 0;
        } else {
            let str = paymentCashAmount === 0 ? '' : paymentCashAmount.toString();
            if(str.length < 12) { str += char; paymentCashAmount = parseFloat(str) || 0; }
        }
        window.posRefreshCashDisplay();
    };

    window.posSetCashAmount = (val) => {
        paymentCashAmount = val;
        window.posRefreshCashDisplay();
    };

    window.posRefreshCashDisplay = () => {
        const display = document.getElementById('pos-pay-display-cash');
        const btnSubmit = document.getElementById('btn-pos-pay-submit');
        let subtotal = posCart.reduce((s, x) => s + (x.qty * x.sellPrice), 0);
        let gTotal = subtotal + posBiayaNominal; 

        display.innerText = `Rp ${fmtRp(paymentCashAmount)}`;
        display.classList.add('text-emerald-600');
        display.classList.remove('text-gray-400');

        if (paymentCashAmount >= gTotal && gTotal > 0) {
            btnSubmit.className = "w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm shadow-sm cursor-pointer hover:bg-emerald-600 transition";
            btnSubmit.classList.remove('pointer-events-none');
            // Auto submit jika layar di Numpad FastCash (Manual terlihat)
            if(document.getElementById('btn-pos-slide-manual').classList.contains('flex')) {
                setTimeout(() => window.posSelesaiTransaksi(false), 300);
            }
        } else {
            btnSubmit.className = "w-7 h-7 rounded-lg bg-gray-200 text-white flex items-center justify-center text-sm pointer-events-none transition";
        }
    };

    window.posSelectPaymentMethod = (method) => {
        document.getElementById('pos-pay-method-label').innerHTML = `Metode : ${method}`;
        document.getElementById('modal-pos-pilih-pay-method').classList.add('hidden');
    };

    // --- PISAH BAYAR ---
    window.posOpenPisahBayar = () => { document.getElementById('modal-pos-split-select').classList.remove('hidden'); };
    window.posClosePisahBayar = () => { 
        document.getElementById('view-pos-split-pay').classList.add('hidden');
        document.getElementById('view-pos-pembayaran').classList.remove('hidden');
    };
    window.posToggleSplitMethod = (btn, method) => {
        const icon = btn.querySelector('i');
        if(icon.classList.contains('fa-circle-check')) {
            icon.className = 'fa-regular fa-circle-check';
            btn.className = 'w-full bg-white border border-gray-300 text-gray-400 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2 transition';
            posSplitMethods = posSplitMethods.filter(m => m !== method);
        } else {
            if(posSplitMethods.length >= 2) return alert("Maksimal 2 metode pisah bayar!");
            icon.className = 'fa-solid fa-circle-check';
            btn.className = 'w-full bg-emerald-50 border border-emerald-500 text-emerald-700 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2 transition';
            posSplitMethods.push(method);
        }
    };
    window.posConfirmSplitSelect = () => {
        if(posSplitMethods.length !== 2) return alert("Pilih tepat 2 metode!");
        document.getElementById('modal-pos-split-select').classList.add('hidden');
        document.getElementById('view-pos-pembayaran').classList.add('hidden');
        document.getElementById('view-pos-split-pay').classList.remove('hidden');
        
        let subtotal = posCart.reduce((s, x) => s + (x.qty * x.sellPrice), 0);
        let gTotal = subtotal + posBiayaNominal;
        
        document.getElementById('pos-split-m1').innerText = posSplitMethods[0];
        document.getElementById('pos-split-m2').innerText = posSplitMethods[1];
        document.getElementById('input-split-1').value = Math.floor(gTotal / 2);
        window.posCalcSplit();
    };
    window.posCalcSplit = () => {
        let subtotal = posCart.reduce((s, x) => s + (x.qty * x.sellPrice), 0);
        let gTotal = subtotal + posBiayaNominal;
        let v1 = parseFloat(document.getElementById('input-split-1').value) || 0;
        if (v1 > gTotal) { v1 = gTotal; document.getElementById('input-split-1').value = v1; }
        document.getElementById('input-split-2').value = (gTotal - v1);
    };

    // --- PROSES TRANSAKSI & POTONG STOK REALTIME ---
    window.posSelesaiTransaksi = async (isSplit = false) => {
        let subtotal = posCart.reduce((s, x) => s + (x.qty * x.sellPrice), 0);
        let gTotal = subtotal + posBiayaNominal;

        if(!isSplit && paymentCashAmount < gTotal) return alert("Uang pembayaran kurang!");

        try {
            // POTONG STOK FISIK DI MEMORI GLOBAL window.products
            for (let item of posCart) {
                const prod = window.products.find(p => p.id === item.product.id);
                if (prod && prod.useStock !== false && !item.isManual) {
                    prod.stock = Math.max(0, (Number(prod.stock) || 0) - item.qty);
                    
                    if(window.fb && window.db && !String(prod.id).startsWith('local_')) {
                        await window.fb.updateDoc(window.fb.doc(window.db, "products", prod.id), { stock: prod.stock });
                    }
                }
            }

            if(isSplit) {
                document.getElementById('modal-pos-confirm-split').classList.add('hidden');
                document.getElementById('view-pos-split-pay').classList.add('hidden');
            } else {
                document.getElementById('view-pos-pembayaran').classList.add('hidden');
            }
            document.getElementById('view-pos-success').classList.remove('hidden');

            document.getElementById('pos-succ-total').innerText = `Rp ${fmtRp(gTotal)}`;
            document.getElementById('pos-succ-change').innerText = `Rp ${fmtRp(isSplit ? 0 : Math.max(0, paymentCashAmount - gTotal))}`;
            
        } catch(e) {
            console.error("Gagal sinkronisasi transaksi:", e);
            alert("Terjadi kesalahan saat menyimpan transaksi.");
        }
    };

    window.posKembaliKeAwal = () => {
        posCart = [];
        posCustomer = null;
        posBiayaNominal = 0;
        paymentCashAmount = 0;
        
        document.getElementById('view-pos-success').classList.add('hidden');
        document.getElementById('view-penjualan').classList.remove('hidden');
        
        // REFRESH LAYAR AGAR STOK YANG TERPOTONG LANGSUNG TERLIHAT
        window.renderPosProductList(document.getElementById('input-pos-search').value);
        window.updatePosCartUI();
        if(window.renderInventoryCards) window.renderInventoryCards(window.products);
    };

    window.posViewDigitalReceipt = () => {
        let subtotal = posCart.reduce((s, x) => s + (x.qty * x.sellPrice), 0);
        let gTotal = subtotal + posBiayaNominal;
        
        let html = `
            <div class="text-center font-extrabold text-[13px] uppercase mb-1 border-b border-dashed border-gray-400 pb-2">REJEKI LANCAR</div>
            <div class="text-center text-[10px] mb-3">Toko Macam Plastik<br>Jl. Bromo, PasarBaru, Pujon Lor</div>
            <div class="border-b border-dashed border-gray-400 pb-2 mb-2 space-y-2">
        `;
        posCart.forEach(item => {
            const itemTotal = item.qty * item.sellPrice;
            html += `
                <div>
                    <p class="font-bold">${item.product.name}</p>
                    <div class="flex justify-between"><p>${item.qty} ${item.product.unit||'pcs'} X Rp ${fmtRp(item.sellPrice)}</p><p>Rp ${fmtRp(itemTotal)}</p></div>
                </div>
            `;
        });
        html += `
            </div>
            <div class="border-b border-dashed border-gray-400 pb-2 mb-2">
                <div class="flex justify-between"><p>Sub Total</p><p>Rp ${fmtRp(subtotal)}</p></div>
                <div class="flex justify-between font-extrabold text-sm mt-1"><p>Total</p><p>Rp ${fmtRp(gTotal)}</p></div>
            </div>
            <div class="text-center text-[10px] leading-relaxed">Terima kasih telah berbelanja!</div>
        `;
        document.getElementById('content-pos-struk-digital').innerHTML = html;
        document.getElementById('view-pos-success').classList.add('hidden');
        document.getElementById('view-pos-struk').classList.remove('hidden');
    };

})();
