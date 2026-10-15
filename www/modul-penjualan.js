// ============================================================================
// MODUL 14: TRANSAKSI PENJUALAN (POS UTAMA) - KLASIK UI & FIX LOGIC
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN UTAMA POS (PENJUALAN) KLASIK === -->
        <div id="view-penjualan" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative z-20">
            <!-- Header Solid Hijau Klasik -->
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-4">
                    <button onclick="switchView('manajemen-hub')" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold tracking-wide">Penjualan</h2>
                </div>
                <div class="flex items-center space-x-3">
                    <button class="bg-amber-400 hover:bg-amber-500 text-white font-bold text-xs px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-sm">
                        <span id="pos-header-draft-count">0</span><i class="fa-solid fa-bell"></i>
                    </button>
                    <button onclick="posOpenCustomerPoin()" class="w-8 h-8 rounded-full border border-white text-white flex items-center justify-center text-sm"><i class="fa-regular fa-star"></i></button>
                    <div class="relative">
                        <button onclick="document.getElementById('dropdown-pos-main').classList.toggle('hidden')" class="text-white text-xl p-1 focus:outline-none"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div id="dropdown-pos-main" class="absolute right-0 top-10 w-56 bg-white rounded-md shadow-2xl py-1 hidden z-50 border border-gray-100 text-gray-800">
                            <button onclick="posBatalkanTransaksi()" class="w-full text-left px-4 py-3 text-xs font-bold hover:bg-emerald-50 transition block border-b border-gray-100">Batalkan transaksi</button>
                            <button onclick="posBukaPengaturan()" class="w-full text-left px-4 py-3 text-xs font-bold hover:bg-emerald-50 transition block border-b border-gray-100">Pengaturan Transaksi</button>
                            <button onclick="alert('Mode Optimasi Diaktifkan')" class="w-full text-left px-4 py-3 text-xs font-bold hover:bg-emerald-50 transition block">Mode Optimasi (NEW)</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Baris Alat (Toolbar) -->
            <div class="px-3 py-2 bg-white border-b relative z-20 h-14 flex items-center shadow-xs" id="pos-toolbar-normal">
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
            <div class="px-3 py-2 bg-white border-b relative z-20 h-14 flex items-center hidden space-x-2 shadow-xs" id="pos-toolbar-search">
                <div class="relative flex-1">
                    <input type="text" id="input-pos-search" oninput="renderPosProductList(this.value)" placeholder="Cari nama atau kode" class="w-full pl-3 pr-4 py-2 border border-emerald-600 rounded-full text-xs font-bold text-gray-900 focus:outline-none">
                </div>
                <label class="flex items-center space-x-1.5 cursor-pointer text-xs font-bold text-gray-700">
                    <input type="checkbox" id="chk-pos-search-code" class="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                    <span>Kode</span>
                </label>
                <button onclick="document.getElementById('input-pos-search').value=''; renderPosProductList('');" class="text-red-500 text-xs font-bold px-1">Hapus</button>
                <button onclick="posToggleSearchBar(false)" class="text-emerald-700 text-xl px-1"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <!-- Baris Alat (Barcode Input Mode) -->
            <div class="px-3 py-2 bg-white border-b relative z-20 h-14 flex items-center hidden space-x-2 shadow-xs" id="pos-toolbar-barcode">
                <div class="relative flex-1">
                    <input type="text" id="input-pos-barcode-fast" onkeydown="handlePosFastBarcode(event)" placeholder="Ketik barcode lalu enter" class="w-full pl-3 pr-4 py-2 border-b-2 border-emerald-600 text-xs font-bold text-emerald-700 focus:outline-none bg-transparent">
                </div>
                <button onclick="posToggleBarcodeBar(false)" class="text-emerald-700 text-xl px-2"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <!-- Kategori Scroll (Pill Bulat) -->
            <div class="bg-white border-b py-2.5 px-3 overflow-x-auto whitespace-nowrap hide-scrollbar flex space-x-2 items-center" id="container-pos-categories">
                <!-- Disuntik via JS -->
            </div>

            <!-- Daftar Produk Vertikal (Klasik) -->
            <div class="flex-1 overflow-y-auto pb-24 bg-gray-50 divide-y divide-gray-200" id="container-pos-products" onclick="document.getElementById('dropdown-pos-main').classList.add('hidden')"></div>

            <!-- Bar Hijau Bawah (Sticky) -->
            <div class="p-4 bg-transparent absolute bottom-0 left-0 right-0 z-10 flex space-x-2">
                <button onclick="posLanjutKeReview()" type="button" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-md shadow-lg flex justify-between items-center text-xs uppercase tracking-wider transition active:scale-95">
                    <span><span id="pos-cart-count" class="text-base font-extrabold mr-1">0</span> Barang</span>
                    <span>LANJUT <i class="fa-solid fa-chevron-right ml-2"></i></span>
                </button>
                <button onclick="posOpenInputCustomer()" type="button" class="w-14 h-12 rounded-md bg-white border border-emerald-600 text-emerald-600 flex items-center justify-center text-xl shadow-lg relative transition hover:bg-emerald-50">
                    <i class="fa-regular fa-user"></i>
                    <span id="pos-cust-dot" class="hidden absolute top-2 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
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
                <span>Diskon : -</span>
                <span>Pajak : -</span>
                <span>Biaya Layanan: - <i class="fa-solid fa-chevron-down text-emerald-600"></i></span>
                <span>BIAYA : <span id="pos-review-biaya-val">Rp 0</span> <i class="fa-solid fa-chevron-down text-emerald-600"></i></span>
            </div>

            <!-- Daftar Keranjang -->
            <div class="flex-1 overflow-y-auto bg-white divide-y divide-gray-100" id="container-pos-review-items"></div>

            <!-- Footer Section -->
            <div class="bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div class="flex border-b border-gray-100 text-xs font-bold text-gray-600">
                    <button onclick="posShowPotensiUntung()" class="flex-1 py-3.5 border-r border-gray-100 flex justify-center items-center space-x-2 hover:bg-gray-50">
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
                    <button class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm hover:bg-emerald-200"><i class="fa-solid fa-share-nodes"></i></button>
                    <button class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm hover:bg-emerald-200"><i class="fa-solid fa-print"></i></button>
                    <button onclick="document.getElementById('view-pos-review').classList.add('hidden'); document.getElementById('view-penjualan').classList.remove('hidden');" class="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg shadow-sm hover:bg-emerald-200"><i class="fa-solid fa-pen"></i></button>
                    <button onclick="posGoToPembayaran()" class="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">CHECKOUT</button>
                </div>
            </div>
        </div>

        <!-- === 4. HALAMAN PEMBAYARAN KASIR === -->
        <div id="view-pos-pembayaran" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white flex justify-between items-center shadow-sm z-20 border-b">
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
                    <label class="flex items-center space-x-2 cursor-pointer text-xs font-bold text-gray-900">
                        <input type="checkbox" id="chk-pos-pay-piutang" onchange="posTogglePiutang(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span>Piutang</span>
                    </label>
                    <div onclick="posOpenInputCustomer()" class="flex-1 bg-white border border-emerald-600 rounded-lg p-3 text-xs font-bold text-emerald-700 cursor-pointer truncate shadow-sm" id="box-pos-pay-cust">Pilih Pelanggan</div>
                    <div class="w-24 bg-white border border-gray-300 rounded-lg p-3 text-xs font-bold text-gray-500 cursor-pointer text-center shadow-sm">No. Meja</div>
                </div>

                <div class="mb-3">
                    <input type="text" id="input-pos-pay-notes" placeholder="Keterangan Struk" class="w-full bg-gray-50 rounded-lg p-3 text-xs font-bold text-gray-900 focus:outline-none border border-gray-200 focus:border-emerald-500">
                </div>

                <div class="flex space-x-2 mb-3 text-[10px] font-bold text-gray-600">
                    <div class="flex-1 border border-gray-300 rounded-lg p-2.5 flex justify-center items-center bg-gray-50">Diskon : 0%</div>
                    <div class="flex-1 border border-gray-300 rounded-lg p-2.5 flex justify-center items-center bg-gray-50">Pajak : 0%</div>
                    <div class="flex-1 relative cursor-pointer" onclick="document.getElementById('modal-pos-pilih-pay-method').classList.remove('hidden')">
                        <div class="border border-gray-900 rounded-lg p-2.5 flex justify-between items-center text-gray-900 bg-white">
                            <span id="pos-pay-method-label">Metode : Cash</span><i class="fa-solid fa-chevron-down"></i>
                        </div>
                    </div>
                </div>

                <!-- Fix Numpad Date to Native DateTime -->
                <div class="mb-4">
                    <label class="block text-[10px] text-gray-500 font-bold mb-1 ml-1">Waktu Pembayaran</label>
                    <input type="datetime-local" id="input-pos-pay-date" class="w-full border border-gray-300 rounded-lg p-3 text-xs font-bold text-gray-900 bg-white focus:outline-none focus:border-emerald-600 shadow-sm">
                </div>

                <button id="btn-pos-slide-manual" onclick="posSlideNumpad('left')" class="w-full bg-white border border-emerald-600 text-emerald-700 font-bold py-3 rounded-t-xl shadow-sm text-xs items-center justify-between px-4 hidden transition mb-2">
                    <div class="flex items-center space-x-2"><i class="fa-regular fa-keyboard text-lg"></i><span>Ketik Nominal</span></div>
                    <i class="fa-solid fa-chevron-right"></i>
                </button>

                <!-- SLIDER NUMPAD -->
                <div class="flex-1 relative overflow-hidden mt-1 bg-gray-50 rounded-2xl p-2 pb-0 border border-gray-100">
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

        <!-- HTML Modals Sisanya (Multisatuan, Split Pay, Success, JSON) akan ditangani di JS bawah -->
    `;

    // 2. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <!-- === MODALS POS === -->
        <div id="modal-pos-add-temp" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">TRANSAKSI TAMBAHAN</h3>
                <div class="space-y-3 mb-4 text-xs font-bold text-gray-900">
                    <input type="text" id="pos-add-temp-name" placeholder="Barang atau jasa" class="w-full border border-emerald-600 rounded-full p-3.5 px-4 focus:outline-none">
                    <input type="text" id="pos-add-temp-sku" placeholder="Kode" class="w-full border border-emerald-600 rounded-full p-3.5 px-4 focus:outline-none">
                    <input type="number" id="pos-add-temp-buy" placeholder="Harga dasar" class="w-full border border-emerald-600 rounded-full p-3.5 px-4 focus:outline-none">
                    <input type="number" id="pos-add-temp-sell" placeholder="Harga jual" class="w-full border border-emerald-600 rounded-full p-3.5 px-4 focus:outline-none">
                    <div class="flex justify-center items-center space-x-8 py-2 text-xl border border-gray-200 rounded-full w-3/4 mx-auto">
                        <button onclick="posTempAdjQty(-1)" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-minus"></i></button>
                        <span id="pos-temp-qty-val">1</span>
                        <button onclick="posTempAdjQty(1)" class="text-gray-400 hover:text-gray-600"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-2">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="posAddTempItemToCart()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-biaya-tambahan" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center">MODUL BIAYA</h3>
                <div class="space-y-4 text-xs font-semibold text-gray-600">
                    <div><label class="block mb-1">Nama Biaya (Ex: Bungkus, Stiker, dll)</label><input type="text" id="input-pos-rin-biaya-name" placeholder="Ongkir" class="w-full border border-gray-300 rounded-full p-3.5 px-4 font-bold text-gray-900 focus:outline-none focus:border-emerald-600"></div>
                    <div>
                        <label class="block mb-1">Nominal</label>
                        <div class="flex border border-gray-300 rounded-full overflow-hidden focus-within:border-emerald-600">
                            <div class="bg-emerald-50 text-emerald-700 font-bold px-4 flex items-center justify-center border-r border-gray-300">Rp</div>
                            <input type="number" id="input-pos-rin-biaya-val" placeholder="0" class="flex-1 p-3.5 px-3 font-bold text-gray-900 focus:outline-none">
                        </div>
                    </div>
                    <div class="pt-2"><span class="block mb-2">Daftar Biaya</span>
                        <div onclick="posApplyBiaya('Ongkir', 10000)" class="flex justify-between items-center cursor-pointer bg-gray-50 p-3 rounded-xl transition border border-transparent hover:border-emerald-200">
                            <div><span class="font-bold text-gray-900 block">Ongkir</span><span class="text-[10px] text-gray-500">Rp 10.000</span></div>
                            <i class="fa-solid fa-check text-emerald-600 text-lg hidden"></i>
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-6">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="posApplyBiayaCustom()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-pilih-pay-method" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">PILIH PEMBAYARAN</h3>
                <div class="grid grid-cols-2 gap-3 mb-6">
                    <button onclick="posSelectPaymentMethod('Cash')" class="w-full bg-white border border-gray-300 text-gray-900 font-bold py-4 rounded-xl shadow-xs text-xs hover:bg-emerald-50 transition">Cash</button>
                    <button onclick="posSelectPaymentMethod('Transfer')" class="w-full bg-emerald-100/50 border border-emerald-500 text-emerald-700 font-bold py-4 rounded-xl shadow-xs text-xs transition">Transfer</button>
                    <button onclick="posSelectPaymentMethod('QRIS 0,5%')" class="w-full bg-white border border-gray-300 text-gray-900 font-bold py-4 rounded-xl shadow-xs text-xs hover:bg-emerald-50 transition">QRIS 0,5%</button>
                </div>
            </div>
        </div>

        <div id="modal-pos-split-select" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">PILIH 2 PEMBAYARAN</h3>
                <div class="bg-emerald-50 border border-emerald-100 p-3 rounded-lg flex space-x-3 items-start mb-4 text-[10px] font-semibold text-gray-700">
                    <i class="fa-solid fa-circle-info text-emerald-600 text-sm mt-0.5"></i><p>Pembulatan tidak akan diterapkan pada Pisah Bayar</p>
                </div>
                <div class="grid grid-cols-2 gap-3 mb-6 font-bold text-xs">
                    <button onclick="posToggleSplitMethod(this, 'Cash')" class="w-full bg-emerald-50 border border-emerald-500 text-emerald-700 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2"><i class="fa-solid fa-circle-check"></i><span>Cash</span></button>
                    <button onclick="posToggleSplitMethod(this, 'Transfer')" class="w-full bg-emerald-50 border border-emerald-500 text-emerald-700 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2"><i class="fa-solid fa-circle-check"></i><span>Transfer</span></button>
                    <button onclick="posToggleSplitMethod(this, 'QRIS')" class="w-full bg-white border border-gray-300 text-gray-400 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2"><i class="fa-regular fa-circle-check"></i><span>QRIS</span></button>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="posConfirmSplitSelect()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">SET</button>
                </div>
            </div>
        </div>
    `;

    const wsContainer = document.getElementById('workspace-container');
    if (wsContainer) wsContainer.insertAdjacentHTML('beforeend', viewsHTML);

    const mdContainer = document.getElementById('modals-container');
    if (mdContainer) mdContainer.insertAdjacentHTML('beforeend', modalsHTML);


    // ========================================================================
    // 3. STATE & LOGIKA POS PENJUALAN UTAMA
    // ========================================================================
    let posCart = []; 
    let posCustomer = null; 
    let posBiayaLabel = 'Ongkir';
    let posBiayaNominal = 0;
    let paymentCashAmount = 0;
    let isFastCashEditMode = false;
    let posSplitMethods = ['Cash', 'Transfer']; // Default Split

    // Inisialisasi Numpad DateTime
    setTimeout(() => {
        const dtInput = document.getElementById('input-pos-pay-date');
        if (dtInput) {
            const now = new Date();
            const offset = now.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
            dtInput.value = localISOTime;
        }
    }, 500);

    window.posToggleSearchBar = (show) => {
        document.getElementById('pos-toolbar-normal').classList.toggle('hidden', show);
        document.getElementById('pos-toolbar-search').classList.toggle('hidden', !show);
        if(show) {
            document.getElementById('pos-toolbar-barcode').classList.add('hidden');
            setTimeout(() => document.getElementById('input-pos-search').focus(), 100);
        }
    };

    window.posToggleBarcodeBar = (show) => {
        document.getElementById('pos-toolbar-normal').classList.toggle('hidden', show);
        document.getElementById('pos-toolbar-barcode').classList.toggle('hidden', !show);
        if(show) {
            document.getElementById('pos-toolbar-search').classList.add('hidden');
            setTimeout(() => document.getElementById('input-pos-barcode-fast').focus(), 100);
        }
    };

    window.handlePosFastBarcode = (e) => {
        if(e.key === 'Enter') {
            const code = e.target.value.trim().toLowerCase();
            if(!code) return;
            const found = (window.products || []).find(p => (p.sku || '').toLowerCase() === code || (p.name || '').toLowerCase() === code);
            if(found) {
                // Langsung masuk keranjang tanpa popup jika default
                if(found.type === 'Default' || !found.type) {
                    const ex = posCart.find(c => c.product.id === found.id);
                    if(ex) ex.qty++;
                    else posCart.push({ product: found, qty: 1, sellPrice: found.price || 0, discount: 0, notes: '' });
                    window.renderPosProductList(document.getElementById('input-pos-search').value);
                    window.updatePosCartUI();
                } else {
                    // Jika Varian/Multisatuan buka modal
                    alert("Barang Multisatuan/Varian, gunakan klik manual.");
                }
            } else {
                alert("Barang tidak ditemukan!");
            }
            e.target.value = '';
        }
    };

    window.posInitCategories = () => {
        const catBox = document.getElementById('container-pos-categories');
        if (!catBox || catBox.children.length > 0) return; 
        
        let cats = ["Semua"];
        (window.products || []).forEach(p => {
            const c = p.category && p.category.trim() !== '' ? p.category.trim() : 'Umum';
            if (!cats.includes(c)) cats.push(c);
        });

        catBox.innerHTML = '';
        cats.forEach((c, idx) => {
            const cls = idx === 0 
                ? 'bg-emerald-600 text-white border-emerald-600 font-bold rounded-full px-4 py-1.5 border' 
                : 'bg-white text-emerald-600 border-emerald-600 font-semibold rounded-full px-4 py-1.5 border hover:bg-emerald-50';
            catBox.innerHTML += `<button onclick="posSelectCategory('${c}')" id="btn-pos-cat-${c.replace(/\s+/g, '-')}" class="${cls} transition">${c}</button>`;
        });
    };

    window.posSelectCategory = (cat) => {
        document.querySelectorAll('#container-pos-categories button').forEach(b => {
            b.className = "bg-white text-emerald-600 border-emerald-600 font-semibold rounded-full px-4 py-1.5 border hover:bg-emerald-50 transition";
        });
        const activeBtn = document.getElementById(`btn-pos-cat-${cat.replace(/\s+/g, '-')}`);
        if (activeBtn) activeBtn.className = "bg-emerald-600 text-white border-emerald-600 font-bold rounded-full px-4 py-1.5 border transition";
        
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
            let stockColor = 'text-emerald-600';
            if(stk <= 0) stockColor = 'text-red-500';
            else if(stk <= 20) stockColor = 'text-amber-500';

            const initials = p.name ? p.name.trim().substring(0, 2).toUpperCase() : 'RL';
            const priceFmt = Number(p.price || 0).toLocaleString('id-ID');
            
            const cItems = posCart.filter(c => c.product.id === p.id);
            const selQty = cItems.reduce((s, x) => s + x.qty, 0);
            const badgeQty = selQty > 0 ? `<div class="w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-900 font-extrabold text-sm bg-white shadow-xs ml-3">${selQty}</div>` : '';

            container.innerHTML += `
                <div onclick="posQuickAddToCart('${p.id}')" class="px-4 py-3 bg-white flex items-center justify-between hover:bg-emerald-50/50 cursor-pointer transition">
                    <div class="flex items-start space-x-3.5 flex-1 min-w-0 pr-2">
                        <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-extrabold text-lg flex-shrink-0 shadow-inner border border-gray-200 overflow-hidden">
                            ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover">` : initials}
                        </div>
                        <div class="min-w-0 pt-0.5">
                            <h4 class="font-extrabold text-[13px] text-gray-700 truncate">${p.name}</h4>
                            <p class="text-[10px] text-gray-500 font-semibold mt-0.5">sisa <span class="${stockColor}">${stk}</span> <span class="mx-1">â€¢</span> Rp ${priceFmt}</p>
                        </div>
                    </div>
                    ${badgeQty}
                </div>
            `;
        });
    }

    // --- KERANJANG & CHECKOUT ---
    window.posQuickAddToCart = (pid) => {
        const p = (window.products || []).find(x => x.id === pid);
        if (!p) return;
        
        if (p.useStock !== false && p.stock <= 0) return alert("Stok barang habis!");

        const existingIdx = posCart.findIndex(c => c.product.id === pid);
        if(existingIdx >= 0) {
            if (p.useStock !== false && posCart[existingIdx].qty >= p.stock) return alert("Mencapai batas maksimal stok fisik!");
            posCart[existingIdx].qty++;
        } else {
            posCart.push({ product: p, qty: 1, sellPrice: p.price || 0, discount: 0, notes: '' });
        }
        
        window.renderPosProductList(document.getElementById('input-pos-search').value);
        window.updatePosCartUI();
    };

    window.updatePosCartUI = () => {
        const tQty = posCart.reduce((s, x) => s + (Number(x.qty) || 0), 0);
        const lbl = document.getElementById('pos-cart-count');
        if (lbl) lbl.innerText = tQty;
    };

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
            const itemTotal = (item.qty * item.sellPrice) - (item.discount || 0);
            subtotal += itemTotal;
            const noteStr = item.notes ? ` <span class="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded ml-1">${item.notes}</span>` : '';

            container.innerHTML += `
                <div class="px-4 py-3.5 flex items-start space-x-3 bg-white hover:bg-gray-50 transition border-b border-gray-50">
                    <span class="text-[11px] font-bold text-gray-400 mt-0.5 w-4">${idx + 1}</span>
                    <div class="flex-1 min-w-0 space-y-0.5">
                        <h4 class="font-extrabold text-xs text-gray-900 truncate">${item.product.name}${noteStr}</h4>
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
            window.renderPosProductList(document.getElementById('input-pos-search').value);
        }
    };

    window.posApplyBiaya = (label, val) => {
        posBiayaLabel = label;
        posBiayaNominal = val;
        document.getElementById('modal-pos-biaya-tambahan').classList.add('hidden');
        window.renderPosReviewItems();
    };

    window.posApplyBiayaCustom = () => {
        const n = document.getElementById('input-pos-rin-biaya-name').value || 'Biaya Tambahan';
        const v = parseFloat(document.getElementById('input-pos-rin-biaya-val').value) || 0;
        posApplyBiaya(n, v);
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
        
        // Render Numpad Cepat
        const box = document.getElementById('pos-fastcash-container');
        box.innerHTML = `<button onclick="posSetCashAmount(${gTotal})" class="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-md shadow-xs text-sm active:bg-emerald-700">Uang Pas</button>`;
        [10000, 20000, 50000, 100000].forEach(nom => {
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
        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal; 

        display.innerText = `Rp ${fmtRp(paymentCashAmount)}`;
        display.classList.add('text-emerald-600');
        display.classList.remove('text-gray-400');

        if (paymentCashAmount >= gTotal && gTotal > 0) {
            btnSubmit.className = "w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm shadow-sm cursor-pointer hover:bg-emerald-600 transition";
            btnSubmit.classList.remove('pointer-events-none');
            
            // Auto Selesai Jika Uang Pas / Lebih dan Numpad di FastCash (Simulasi UX Cepat)
            if(document.getElementById('btn-pos-slide-manual').classList.contains('flex')) {
                setTimeout(() => window.posSelesaiTransaksi(false), 300);
            }
        } else {
            btnSubmit.className = "w-7 h-7 rounded-lg bg-gray-200 text-white flex items-center justify-center text-sm pointer-events-none transition";
        }
    };

    window.posSelectPaymentMethod = (method) => {
        document.getElementById('pos-pay-method-label').innerHTML = `Metode : ${method} <i class="fa-solid fa-chevron-down ml-1 text-gray-500 text-[10px]"></i>`;
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
            if(posSplitMethods.length >= 2) return alert("Hanya bisa memilih maksimal 2 metode pisah bayar!");
            icon.className = 'fa-solid fa-circle-check';
            btn.className = 'w-full bg-emerald-50 border border-emerald-500 text-emerald-700 py-3.5 rounded-full shadow-xs flex items-center justify-center space-x-2 transition';
            posSplitMethods.push(method);
        }
    };
    window.posConfirmSplitSelect = () => {
        if(posSplitMethods.length !== 2) return alert("Pilih tepat 2 metode pembayaran untuk Pisah Bayar!");
        document.getElementById('modal-pos-split-select').classList.add('hidden');
        document.getElementById('view-pos-pembayaran').classList.add('hidden');
        document.getElementById('view-pos-split-pay').classList.remove('hidden');
        
        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal;
        
        document.getElementById('pos-split-m1').innerText = posSplitMethods[0];
        document.getElementById('pos-split-m2').innerText = posSplitMethods[1];
        document.getElementById('input-split-1').value = Math.floor(gTotal / 2);
        window.posCalcSplit();
    };
    window.posCalcSplit = () => {
        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal;
        let v1 = parseFloat(document.getElementById('input-split-1').value) || 0;
        if (v1 > gTotal) { v1 = gTotal; document.getElementById('input-split-1').value = v1; }
        document.getElementById('input-split-2').value = (gTotal - v1);
    };

    // --- PROSES TRANSAKSI & UPDATE STOK REALTIME ---
    window.posSelesaiTransaksi = async (isSplit = false) => {
        let subtotal = posCart.reduce((s, x) => s + ((x.qty * x.sellPrice) - (x.discount || 0)), 0);
        let gTotal = subtotal + posBiayaNominal;

        if(!isSplit && paymentCashAmount < gTotal) return alert("Uang pembayaran kurang!");

        try {
            // POTONG STOK FISIK DI DATABASE GLOBAL window.products
            for (let item of posCart) {
                const prod = window.products.find(p => p.id === item.product.id);
                if (prod && prod.useStock !== false) {
                    prod.stock = Math.max(0, (Number(prod.stock) || 0) - item.qty);
                    
                    // Simpan ke Firestore jika online
                    if(window.fb && window.db && !String(prod.id).startsWith('local_')) {
                        await window.fb.updateDoc(window.fb.doc(window.db, "products", prod.id), { stock: prod.stock });
                    }
                }
            }

            // Tampilkan Layar Sukses
            if(isSplit) {
                document.getElementById('modal-pos-confirm-split').classList.add('hidden');
                document.getElementById('view-pos-split-pay').classList.add('hidden');
            } else {
                document.getElementById('view-pos-pembayaran').classList.add('hidden');
            }
            document.getElementById('view-pos-success').classList.remove('hidden');

            document.getElementById('pos-succ-change').innerText = `Rp ${fmtRp(Math.max(0, paymentCashAmount - gTotal))}`;
            
        } catch(e) {
            console.error("Gagal sinkronisasi transaksi:", e);
            alert("Terjadi kesalahan saat menyimpan transaksi.");
        }
    };

    window.posKembaliKeAwal = () => {
        posCart = [];
        posBiayaNominal = 0;
        paymentCashAmount = 0;
        
        document.getElementById('view-pos-success').classList.add('hidden');
        document.getElementById('view-penjualan').classList.remove('hidden');
        
        // REFRESH LAYAR AGAR STOK YANG TERPOTONG LANGSUNG TERLIHAT
        window.renderPosProductList(document.getElementById('input-pos-search').value);
        window.updatePosCartUI();
    };

})();
