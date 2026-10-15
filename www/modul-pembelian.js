// ============================================================================
// MODUL 13: PEMBELIAN DARI SUPPLIER - KLASIK UI & FIX LOGIC
// ============================================================================

(function() {
    // 1. SUNTIKKAN HTML VIEWS KE DALAM #workspace-container
    const viewsHTML = `
        <!-- === 1. HALAMAN UTAMA PEMBELIAN (KERANJANG) KLASIK === -->
        <div id="view-pembelian" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative z-20">
            <!-- Header Solid Hijau Klasik -->
            <div class="px-4 py-3 bg-emerald-600 text-white flex items-center justify-between shadow-sm z-20">
                <div class="flex items-center space-x-4">
                    <button onclick="switchView('manajemen-hub')" class="text-white text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold tracking-wide">Pembelian</h2>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="pembelianOpenDataDraft()" class="bg-amber-400 hover:bg-amber-500 text-white font-bold text-[11px] px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-sm transition">
                        <span>Draft</span><i class="fa-solid fa-file-invoice"></i>
                    </button>
                    <div class="relative">
                        <button onclick="document.getElementById('dropdown-pembelian-main').classList.toggle('hidden')" class="text-white text-xl p-1 focus:outline-none"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                        <div id="dropdown-pembelian-main" class="absolute right-0 top-10 w-52 bg-white rounded-md shadow-2xl py-1 hidden z-50 border border-gray-100 text-gray-800">
                            <button onclick="pembelianBatalkan()" class="w-full text-left px-4 py-3 text-xs font-bold hover:bg-emerald-50 transition block border-b border-gray-100">Batalkan Pembelian</button>
                            <button onclick="pembelianBukaPengaturan()" class="w-full text-left px-4 py-3 text-xs font-bold hover:bg-emerald-50 transition block border-b border-gray-100">Pengaturan Pembelian</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bilah Kontrol Corong Notifikasi, Filter Sortir, Pencarian, & Barcode -->
            <div class="p-3 bg-white border-b flex items-center space-x-2 relative z-10 shadow-xs">
                <button onclick="document.getElementById('modal-pembelian-notif-stok').classList.remove('hidden')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-filter"></i></button>
                <div class="relative">
                    <button onclick="document.getElementById('dropdown-pembelian-sort').classList.toggle('hidden')" class="text-emerald-700 text-xl px-2 py-1"><i class="fa-solid fa-arrow-up-wide-short"></i></button>
                    <div id="dropdown-pembelian-sort" class="absolute left-0 top-10 w-44 bg-white rounded-md shadow-2xl py-1 hidden z-50 text-xs font-bold text-gray-900 border border-gray-100">
                        <button onclick="pembelianApplySort('name')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block border-b border-gray-50">Barang</button>
                        <button onclick="pembelianApplySort('sku')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block border-b border-gray-50">Kode</button>
                        <button onclick="pembelianApplySort('stock')" class="w-full text-left px-4 py-3 hover:bg-emerald-50 transition block">Stok</button>
                    </div>
                </div>
                <div class="relative flex-1">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><i class="fa-solid fa-search text-sm"></i></span>
                    <input type="text" id="input-search-pembelian" oninput="renderPembelianProductList(this.value)" placeholder="Cari nama atau kode barang" class="w-full pl-10 pr-4 py-2 border border-emerald-600 rounded-full text-xs text-gray-900 focus:outline-none focus:border-emerald-700 bg-white">
                </div>
                <button onclick="if(window.openScannerView) window.openScannerView('pembelian')" class="text-emerald-700 text-xl px-2"><i class="fa-solid fa-barcode"></i></button>
            </div>

            <!-- Daftar Produk Vertikal -->
            <div class="flex-1 overflow-y-auto pb-24 bg-gray-50 divide-y divide-gray-200" onclick="document.getElementById('dropdown-pembelian-main').classList.add('hidden'); document.getElementById('dropdown-pembelian-sort').classList.add('hidden');">
                <div onclick="pembelianBuatBarangBaru()" class="p-4 flex items-center space-x-4 bg-white hover:bg-emerald-50 cursor-pointer transition">
                    <div class="w-12 h-12 rounded-full border-2 border-dashed border-emerald-500 bg-emerald-50 flex items-center justify-center text-emerald-600 text-xl font-bold flex-shrink-0">
                        <i class="fa-solid fa-plus"></i>
                    </div>
                    <span class="font-extrabold text-sm text-emerald-700 tracking-wide uppercase">Buat barang baru</span>
                </div>
                <div id="container-pembelian-products" class="divide-y divide-gray-100 bg-white"></div>
            </div>

            <div class="p-4 bg-transparent absolute bottom-0 left-0 right-0 z-10">
                <button onclick="pembelianLanjutKeRincian()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-full shadow-lg flex justify-between items-center text-xs uppercase tracking-wider transition active:scale-95">
                    <span><span id="pembelian-cart-count" class="text-base font-extrabold mr-1">0</span> Barang</span>
                    <span>LANJUT <i class="fa-solid fa-chevron-right ml-2"></i></span>
                </button>
            </div>
        </div>

        <!-- === 3. RINCIAN PEMBELIAN === -->
        <div id="view-rincian-pembelian" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-gray-50 hidden relative z-30">
            <div class="px-4 py-3 bg-white border-b flex justify-between items-center shadow-sm z-10">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-rincian-pembelian').classList.add('hidden'); document.getElementById('view-pembelian').classList.remove('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Pembelian</h2>
                </div>
                <h2 class="text-base font-extrabold text-gray-900" id="rincian-pembelian-grandtotal">Rp 0</h2>
            </div>
            
            <div class="px-4 py-2.5 bg-amber-50 border-b border-amber-100">
                <p class="text-[10px] text-amber-700 font-bold"><i class="fa-solid fa-circle-info mr-1"></i>Ubah harga jual bisa dilakukan setelah pembelian selesai</p>
            </div>

            <div id="rincian-pembelian-supplier-tab" class="hidden px-4 py-3 bg-white border-b border-gray-200 flex justify-between items-center text-xs font-bold text-gray-900 shadow-xs">
                <div class="flex items-center space-x-2.5">
                    <i class="fa-solid fa-file-invoice text-emerald-600 text-base"></i>
                    <span>Order <span class="font-extrabold text-gray-700" id="rincian-pembelian-supplier-name">Camel (dus)</span></span>
                </div>
                <button onclick="pembelianRemoveSupplier()" class="text-gray-400 hover:text-red-500 text-lg"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <div class="px-4 py-3 bg-white flex justify-between items-center relative z-20 shadow-xs border-b">
                <div class="flex space-x-3">
                    <button onclick="alert('Sorting Nama')" class="border border-emerald-600 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-700 flex items-center space-x-1.5 hover:bg-emerald-50">
                        <i class="fa-solid fa-arrow-up-wide-short"></i><span>Nama</span>
                    </button>
                    <button onclick="document.getElementById('modal-rincian-biaya').classList.remove('hidden')" class="border border-emerald-600 rounded-full px-4 py-1.5 text-xs font-bold text-emerald-700 flex items-center space-x-1.5 hover:bg-emerald-50">
                        <i class="fa-solid fa-plus"></i><span>Biaya</span>
                    </button>
                </div>
                <div class="text-[10px] font-bold text-emerald-700 hidden" id="rincian-label-biaya">Biaya: <span id="rincian-biaya-val-disp">Rp 10.000</span> <i class="fa-solid fa-chevron-down ml-1"></i></div>
            </div>

            <div class="flex-1 overflow-y-auto bg-white pb-24 divide-y divide-gray-100" id="container-rincian-cart-items"></div>

            <div class="p-4 bg-gray-50 border-t absolute bottom-0 left-0 right-0 z-10 flex space-x-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <button onclick="pembelianGoToPembayaran()" type="button" class="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">
                    BAYAR
                </button>
                <button onclick="alert('Masuk Draf')" type="button" class="bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-bold py-3.5 px-6 rounded-full shadow-sm transition active:scale-95 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <i class="fa-solid fa-file-invoice"></i><span>SIMPAN</span>
                </button>
            </div>
        </div>

        <!-- === 4. HALAMAN PEMBAYARAN PEMBELIAN === -->
        <div id="view-pembayaran-pembelian" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-white hidden relative z-40">
            <div class="px-4 py-3 bg-white flex justify-between items-center z-20 border-b">
                <div class="flex items-center space-x-3">
                    <button onclick="document.getElementById('view-pembayaran-pembelian').classList.add('hidden'); document.getElementById('view-rincian-pembelian').classList.remove('hidden');" class="text-gray-900 text-xl font-bold p-1"><i class="fa-solid fa-chevron-left"></i></button>
                    <h2 class="text-base font-bold text-gray-900">Pembayaran Pembelian</h2>
                </div>
                <div class="flex items-center space-x-2">
                    <h2 class="text-base font-extrabold text-gray-900" id="pembayaran-grandtotal">Rp 0</h2>
                    <button id="btn-pembayaran-submit" onclick="pembelianSelesaiTransaksi()" class="w-7 h-7 rounded-lg bg-gray-200 text-white flex items-center justify-center text-sm transition pointer-events-none">
                        <i class="fa-solid fa-check"></i>
                    </button>
                </div>
            </div>

            <div class="flex-1 overflow-y-auto px-4 pb-4 flex flex-col pt-2">
                <h1 class="text-3xl font-extrabold text-gray-400 text-center py-2 pb-5 transition-colors duration-300" id="pembayaran-display-cash">Rp 0</h1>

                <div class="flex items-center space-x-3 mb-3">
                    <label class="flex items-center space-x-2 cursor-pointer text-xs font-bold text-gray-900 bg-gray-50 border border-gray-200 p-3 rounded-lg flex-shrink-0">
                        <input type="checkbox" id="chk-pembayaran-hutang" onchange="pembelianToggleHutangMode(this.checked)" class="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500">
                        <span>Hutang</span>
                    </label>
                    <div onclick="pembelianPilihSupplierHutang()" class="flex-1 bg-white border border-emerald-600 rounded-lg p-3 text-xs font-bold text-emerald-700 cursor-pointer shadow-sm flex items-center justify-between" id="box-pembayaran-sup-name">
                        <span>Pilih Supplier</span><i class="fa-solid fa-chevron-right text-[10px]"></i>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-3 mb-3">
                    <!-- Native Date Picker for Android Mobile -->
                    <input type="datetime-local" id="input-pembayaran-date" class="w-full border border-gray-300 rounded-lg p-3 text-xs font-bold text-gray-900 bg-white focus:outline-none focus:border-emerald-600 shadow-sm">
                    <div class="relative">
                        <select class="w-full border border-gray-300 rounded-lg p-3 text-xs font-bold text-gray-900 appearance-none bg-white focus:outline-none shadow-sm">
                            <option>Non Cashdrawer</option>
                            <option>Cashdrawer</option>
                        </select>
                        <i class="fa-solid fa-chevron-down text-gray-800 text-xs absolute right-3 top-3.5 pointer-events-none"></i>
                    </div>
                </div>

                <div class="relative mb-5 flex-shrink-0">
                    <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-emerald-600"><i class="fa-solid fa-pen text-sm"></i></span>
                    <input type="text" id="input-pembayaran-keterangan" placeholder="Keterangan untuk di struk" class="w-full pl-9 pr-4 py-3 border border-gray-300 rounded-lg text-xs font-bold text-gray-900 focus:outline-none focus:border-emerald-600 bg-gray-50">
                </div>

                <!-- SLIDER NUMPAD & NOMINAL CEPAT -->
                <div class="flex-1 relative overflow-hidden mt-2 bg-gray-50 rounded-2xl p-2 pb-0 border border-gray-100">
                    <div id="pembayaran-slider-track" class="absolute top-0 left-0 w-[200%] h-full flex transition-transform duration-300 ease-in-out pb-4">
                        
                        <!-- Panel Kiri: Numpad Manual -->
                        <div class="w-1/2 h-full px-2">
                            <div class="grid grid-cols-4 gap-2 h-full">
                                <button onclick="pembelianNumpadInput('7')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">7</button>
                                <button onclick="pembelianNumpadInput('8')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">8</button>
                                <button onclick="pembelianNumpadInput('9')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">9</button>
                                <button onclick="pembelianNumpadInput('C')" class="bg-gray-200 rounded-xl shadow-xs text-xl font-bold text-gray-600 active:bg-gray-300">C</button>
                                
                                <button onclick="pembelianNumpadInput('4')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">4</button>
                                <button onclick="pembelianNumpadInput('5')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">5</button>
                                <button onclick="pembelianNumpadInput('6')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">6</button>
                                <button onclick="pembelianNumpadInput('X')" class="bg-gray-100 rounded-xl shadow-xs text-xl font-bold text-emerald-700 active:bg-gray-200"><i class="fa-solid fa-delete-left"></i></button>
                                
                                <button onclick="pembelianNumpadInput('1')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">1</button>
                                <button onclick="pembelianNumpadInput('2')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">2</button>
                                <button onclick="pembelianNumpadInput('3')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">3</button>
                                <button onclick="pembelianSlideNumpad('right')" class="bg-emerald-100 border border-emerald-300 rounded-xl shadow-xs flex flex-col justify-center items-center text-emerald-700 active:bg-emerald-200 row-span-2">
                                    <span class="text-[11px] font-bold mb-1 border-b border-emerald-300 pb-1">Auto</span><i class="fa-solid fa-money-bill-wave text-2xl"></i>
                                </button>
                                
                                <button onclick="pembelianNumpadInput('0')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">0</button>
                                <button onclick="pembelianNumpadInput('000')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">000</button>
                                <button onclick="pembelianNumpadInput('.')" class="bg-white rounded-xl shadow-xs text-xl font-bold text-gray-700 active:bg-gray-100 border border-gray-100">.</button>
                            </div>
                        </div>

                        <!-- Panel Kanan: Nominal Cepat Hijau -->
                        <div class="w-1/2 h-full px-2 overflow-y-auto">
                            <button onclick="pembelianSlideNumpad('left')" class="w-full bg-white border border-emerald-600 text-emerald-700 font-bold py-3 rounded-lg shadow-sm text-xs flex items-center justify-center space-x-2 mb-3">
                                <i class="fa-regular fa-keyboard text-lg"></i><span>Ketik Manual</span>
                            </button>
                            <div class="grid grid-cols-2 gap-3" id="pembayaran-fastcash-container"></div>
                        </div>

                    </div>
                </div>

            </div>
        </div>

        <!-- === 5. HALAMAN TRANSAKSI BERHASIL === -->
        <div id="view-pembelian-success" class="view-panel flex-1 flex flex-col h-full overflow-hidden bg-emerald-50 hidden relative z-50">
            <div class="flex-1 overflow-y-auto p-4 flex flex-col items-center">
                <div class="w-full bg-white rounded-3xl shadow-xl p-6 flex flex-col items-center mt-6">
                    <h2 class="text-lg font-extrabold text-gray-900 mb-4">Transaksi berhasil!</h2>
                    <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center relative mb-6">
                        <i class="fa-solid fa-box-open text-4xl text-emerald-300"></i>
                        <div class="absolute -bottom-1 -left-1 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs border-2 border-white"><i class="fa-solid fa-check"></i></div>
                    </div>
                    <div class="w-full space-y-3 text-xs font-semibold text-gray-600 mb-4 px-2 border-b border-gray-200 pb-4">
                        <div class="flex justify-between items-center">
                            <span>Total Transaksi</span><span class="text-gray-900 font-extrabold text-sm" id="succ-total">Rp 0</span>
                        </div>
                        <div class="flex justify-between items-center"><span>Kembalian</span><span class="text-gray-900 font-bold" id="succ-change">Rp 0</span></div>
                        <div class="flex justify-between items-center"><span>Supplier</span><span class="text-emerald-600 font-bold" id="succ-sup">-</span></div>
                    </div>
                    <div class="w-full space-y-2 text-xs font-extrabold text-gray-900">
                        <button onclick="alert('Struk sedang dicetak...')" class="w-full flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50"><span>Cetak Struk Pembelian</span><i class="fa-solid fa-chevron-right text-gray-400"></i></button>
                        <button onclick="pembelianOpenUbahHarga()" class="w-full flex justify-between items-center py-3 border-b border-gray-100 hover:bg-gray-50 text-amber-600"><span>Ubah Harga Jual Barang</span><i class="fa-solid fa-chevron-right text-amber-400"></i></button>
                    </div>
                </div>
            </div>
            <div class="p-4 w-full">
                <button onclick="pembelianSelesaiTutup()" type="button" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-full shadow-lg transition active:scale-95 text-xs uppercase tracking-wider">SELESAI</button>
            </div>
        </div>

        <!-- SISA MODAL & VIEW (Multisatuan, Rincian, Ubah Harga Jual) DITANGANI DI JS -->
    `;

    // 2. SUNTIKKAN HTML MODALS KE DALAM #modals-container
    const modalsHTML = `
        <div id="modal-rincian-biaya" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-xs uppercase tracking-wider mb-5 text-center">MODUL BIAYA</h3>
                <div class="space-y-4 text-xs font-semibold text-gray-600">
                    <div>
                        <label class="block mb-1">Nama Biaya (Ex: Ongkos Kirim, Kuli)</label>
                        <input type="text" id="input-rin-biaya-name" placeholder="Ongkos Kirim" class="w-full border border-gray-300 rounded-full p-3.5 px-4 font-bold text-gray-900 focus:outline-none focus:border-emerald-600">
                    </div>
                    <div>
                        <label class="block mb-1">Nominal</label>
                        <div class="flex border border-emerald-600 rounded-full overflow-hidden">
                            <div class="bg-emerald-50 text-emerald-700 font-bold px-4 flex items-center justify-center">Rp</div>
                            <input type="number" id="input-rin-biaya-val" placeholder="15000" class="flex-1 p-3.5 px-2 font-bold text-gray-900 focus:outline-none">
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-6">
                    <button onclick="this.closest('.fixed').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="pembelianSaveBiayaTambahan()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
                </div>
            </div>
        </div>

        <div id="modal-pembelian-multisatuan" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl p-6">
                <h3 class="font-extrabold text-gray-900 text-sm uppercase tracking-wider mb-4 text-center border-b border-gray-100 pb-3">MASUKKAN JUMLAH</h3>
                <div class="flex justify-between items-start mb-5">
                    <div>
                        <h4 class="font-extrabold text-sm text-emerald-800" id="mul-name">Alas TAR 20 O</h4>
                        <p class="text-[10px] text-gray-500 font-semibold mt-0.5" id="mul-sku">115</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-gray-900 font-extrabold" id="mul-price">Rp 2.000</p>
                        <p class="text-[10px] text-gray-500 font-semibold mt-0.5">Stok: <span id="mul-stock">195</span></p>
                    </div>
                </div>
                <div class="space-y-4 mb-5">
                    <div class="flex justify-between items-center text-xs font-semibold text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <span id="mul-unit-lbl" class="font-bold text-gray-800 uppercase">PCS</span>
                        <div class="flex items-center space-x-4 text-lg font-bold text-gray-800">
                            <button onclick="pembelianAdjQty(-1)"><i class="fa-solid fa-minus text-gray-400"></i></button>
                            <input type="number" id="mul-qty-input" value="1" class="w-16 text-center bg-transparent focus:outline-none border-b border-emerald-500 text-emerald-700">
                            <button onclick="pembelianAdjQty(1)"><i class="fa-solid fa-plus text-gray-400"></i></button>
                        </div>
                    </div>
                </div>
                <div class="space-y-4 text-xs">
                    <div>
                        <span class="block text-gray-500 font-semibold mb-1">Harga Beli Baru per Satuan</span>
                        <div class="flex border border-emerald-600 rounded-lg overflow-hidden">
                            <div class="bg-emerald-50 text-emerald-700 font-bold px-4 flex items-center justify-center">Rp</div>
                            <input type="number" id="mul-buyprice" value="950" class="w-full p-3 px-3 font-bold text-gray-900 focus:outline-none">
                        </div>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-3 pt-6 border-t border-gray-100 mt-5">
                    <button onclick="document.getElementById('modal-pembelian-multisatuan').classList.add('hidden')" type="button" class="bg-gray-100 hover:bg-gray-200 text-gray-900 py-3.5 rounded-full font-extrabold text-xs uppercase transition">BATAL</button>
                    <button onclick="pembelianAddToCart()" type="button" class="bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-full font-extrabold text-xs uppercase shadow-md transition">OK</button>
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
    // 3. STATE & LOGIKA UTAMA PEMBELIAN
    // ========================================================================
    let pembelianCart = []; 
    let pembelianSupplier = null; 
    let pembelianBiayaLabel = 'Ongkir';
    let pembelianBiayaNominal = 0;
    let activeProductToAdd = null;
    let paymentCashAmount = 0;

    // Inisialisasi Numpad DateTime Pembelian
    setTimeout(() => {
        const dtInput = document.getElementById('input-pembayaran-date');
        if (dtInput) {
            const now = new Date();
            const offset = now.getTimezoneOffset() * 60000;
            const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
            dtInput.value = localISOTime;
        }
    }, 500);

    // Hook Navigasi
    const prevSwitchView = window.switchView;
    window.switchView = function(viewName) {
        if (typeof prevSwitchView === 'function') prevSwitchView(viewName);
        if (viewName === 'pembelian') {
            const mainHeader = document.getElementById('main-header');
            if (mainHeader) mainHeader.classList.add('hidden');
            window.pembelianInitCategories();
            window.renderPembelianProductList();
        }
    };

    function fmtRp(val) {
        return Number(val || 0).toLocaleString('id-ID', {minimumFractionDigits:0, maximumFractionDigits:2});
    }

    // --- KERANJANG UTAMA & PENGATURAN ---
    window.pembelianInitCategories = () => {
        const catBox = document.getElementById('container-pembelian-categories');
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
            catBox.innerHTML += `<button onclick="pembelianSelectCategory('${c}')" id="btn-pembelian-cat-${c.replace(/\s+/g, '-')}" class="${cls} transition text-[11px]">${c}</button>`;
        });
    };

    window.pembelianSelectCategory = (cat) => {
        document.querySelectorAll('#container-pembelian-categories button').forEach(b => {
            b.className = "bg-white text-emerald-600 border-emerald-600 font-semibold rounded-full px-4 py-1.5 border hover:bg-emerald-50 transition text-[11px]";
        });
        const activeBtn = document.getElementById(`btn-pembelian-cat-${cat.replace(/\s+/g, '-')}`);
        if (activeBtn) activeBtn.className = "bg-emerald-600 text-white border-emerald-600 font-bold rounded-full px-4 py-1.5 border transition text-[11px]";
        
        const k = document.getElementById('input-search-pembelian').value.toLowerCase();
        let list = window.products || [];
        if(cat !== 'Semua') list = list.filter(p => (p.category || 'Umum') === cat);
        if(k) list = list.filter(p => (p.name || '').toLowerCase().includes(k) || (p.sku || '').toLowerCase().includes(k));
        
        renderPembelianListItems(list);
    };

    window.renderPembelianProductList = function(keyword = '') {
        const k = keyword.toLowerCase();
        let list = window.products || [];
        if(k) {
            list = list.filter(p => (p.name || '').toLowerCase().includes(k) || (p.sku || '').toLowerCase().includes(k));
        }
        renderPembelianListItems(list);
    };

    function renderPembelianListItems(list) {
        const container = document.getElementById('container-pembelian-products');
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
            const bpFormat = p.buyPrice ? fmtRp(p.buyPrice) : '0';
            
            const cItems = pembelianCart.filter(c => c.product.id === p.id);
            const selQty = cItems.reduce((s, x) => s + x.qty, 0);

            const badgeQty = selQty > 0 ? `<div class="flex-shrink-0 w-8 h-8 rounded border border-gray-300 flex items-center justify-center text-gray-900 font-extrabold text-sm bg-white shadow-xs ml-3">${selQty}</div>` : '';

            container.innerHTML += `
                <div onclick="pembelianOpenMultiSatuanModal('${p.id}')" class="px-4 py-3 bg-white flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 cursor-pointer transition border-b border-gray-100">
                    <div class="flex items-start space-x-3.5 flex-1 min-w-0 pr-2">
                        <div class="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 font-extrabold text-lg flex-shrink-0 shadow-inner border border-gray-200 overflow-hidden">
                            ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover">` : initials}
                        </div>
                        <div class="min-w-0 pt-0.5">
                            <h4 class="font-extrabold text-[13px] text-gray-700 truncate">${p.name}</h4>
                            <p class="text-[10px] text-gray-500 font-semibold mt-0.5">sisa <span class="${sColor}">${stk}</span> <span class="mx-1">â€¢</span> Beli Rp ${bpFormat}</p>
                        </div>
                    </div>
                    ${badgeQty}
                </div>
            `;
        });
    }

    window.updatePembelianCartCount = () => {
        const tQty = pembelianCart.reduce((s, x) => s + (Number(x.qty) || 0), 0);
        const lbl = document.getElementById('pembelian-cart-count');
        if (lbl) lbl.innerText = tQty;
    };

    window.pembelianOpenMultiSatuanModal = (pid) => {
        const p = (window.products || []).find(x => x.id === pid);
        if (!p) return;
        activeProductToAdd = p;

        const cartItem = pembelianCart.find(c => c.product.id === pid);
        const curQty = cartItem ? (cartItem.qty || 0) : 1;
        const curBP = cartItem ? (cartItem.buyPrice || p.buyPrice || 0) : (p.buyPrice || 0);

        document.getElementById('mul-name').innerText = p.name;
        document.getElementById('mul-sku').innerText = p.sku || '-';
        document.getElementById('mul-price').innerText = `Jual: Rp ${fmtRp(p.price)}`;
        document.getElementById('mul-stock').innerText = p.stock || 0;
        document.getElementById('mul-unit-lbl').innerText = p.unit || 'PCS';
        
        document.getElementById('mul-qty-input').value = curQty;
        document.getElementById('mul-buyprice').value = curBP;
        
        document.getElementById('modal-pembelian-multisatuan').classList.remove('hidden');
    };

    window.pembelianAdjQty = (val) => {
        const el = document.getElementById('mul-qty-input');
        let c = parseInt(el.value) || 0;
        c += val;
        if(c < 1) c = 1;
        el.value = c;
    };

    window.pembelianAddToCart = () => {
        const q = parseInt(document.getElementById('mul-qty-input').value) || 1;
        const bp = parseFloat(document.getElementById('mul-buyprice').value) || 0;

        const existingIdx = pembelianCart.findIndex(c => c.product.id === activeProductToAdd.id);
        const newItem = { product: activeProductToAdd, qty: q, buyPrice: bp };
        
        if (existingIdx >= 0) {
            pembelianCart[existingIdx] = newItem;
        } else {
            pembelianCart.push(newItem);
        }

        document.getElementById('modal-pembelian-multisatuan').classList.add('hidden');
        window.renderPembelianProductList(document.getElementById('input-search-pembelian').value);
        window.updatePembelianCartCount();
        if (!document.getElementById('view-rincian-pembelian').classList.contains('hidden')) {
            window.renderRincianPembelianItems();
        }
    };

    // --- RINCIAN PEMBELIAN ---
    window.pembelianLanjutKeRincian = () => {
        if (pembelianCart.length === 0) return alert("Pilih minimal 1 barang untuk dibeli ke supplier!");
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-rincian-pembelian').classList.remove('hidden');
        window.renderRincianPembelianItems();
    };

    window.renderRincianPembelianItems = () => {
        const container = document.getElementById('container-rincian-cart-items');
        container.innerHTML = '';
        let subtotal = 0;

        pembelianCart.forEach((item, idx) => {
            const itemTotal = item.qty * item.buyPrice;
            subtotal += itemTotal;
            const initials = item.product.name ? item.product.name.substring(0, 2).toUpperCase() : 'RL';

            container.innerHTML += `
                <div onclick="pembelianOpenMultiSatuanModal('${item.product.id}')" class="px-4 py-3.5 flex items-start space-x-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 bg-white">
                    <span class="text-[11px] font-bold text-gray-400 mt-0.5 w-4">${idx + 1}</span>
                    <div class="flex-1 min-w-0 space-y-0.5">
                        <h4 class="font-extrabold text-xs text-gray-900 truncate">${item.product.name}</h4>
                        <p class="text-[11px] text-gray-500 font-semibold">${item.qty} ${item.product.unit || 'pcs'} x Rp ${fmtRp(item.buyPrice)} = <span class="text-gray-900 font-bold">Rp ${fmtRp(itemTotal)}</span></p>
                    </div>
                    <button onclick="event.stopPropagation(); pembelianRemoveCartItem(${idx})" class="text-red-500 hover:text-red-700 text-lg p-1 transition"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            `;
        });

        const gTotal = subtotal + pembelianBiayaNominal;
        document.getElementById('rincian-pembelian-grandtotal').innerText = `Rp ${fmtRp(gTotal)}`;

        const tabSup = document.getElementById('rincian-pembelian-supplier-tab');
        if (pembelianSupplier) {
            document.getElementById('rincian-pembelian-supplier-name').innerText = pembelianSupplier.name;
            tabSup.classList.remove('hidden');
            tabSup.classList.add('flex');
        } else {
            tabSup.classList.add('hidden');
            tabSup.classList.remove('flex');
        }

        const lblBiaya = document.getElementById('rincian-label-biaya');
        if (pembelianBiayaNominal > 0) {
            document.getElementById('rincian-biaya-val-disp').innerText = `Rp ${fmtRp(pembelianBiayaNominal)}`;
            lblBiaya.classList.remove('hidden');
            lblBiaya.classList.add('block');
        } else {
            lblBiaya.classList.add('hidden');
            lblBiaya.classList.remove('block');
        }
    };

    window.pembelianRemoveCartItem = (idx) => {
        pembelianCart.splice(idx, 1);
        if (pembelianCart.length === 0) {
            document.getElementById('view-rincian-pembelian').classList.add('hidden');
            document.getElementById('view-pembelian').classList.remove('hidden');
            window.updatePembelianCartCount();
            window.renderPembelianProductList(document.getElementById('input-search-pembelian').value);
        } else {
            window.renderRincianPembelianItems();
            window.updatePembelianCartCount();
            window.renderPembelianProductList(document.getElementById('input-search-pembelian').value);
        }
    };

    window.pembelianSaveBiayaTambahan = () => {
        const name = document.getElementById('input-rin-biaya-name').value.trim() || 'Ongkir';
        const val = parseFloat(document.getElementById('input-rin-biaya-val').value) || 0;
        pembelianBiayaLabel = name;
        pembelianBiayaNominal = val;
        document.getElementById('modal-rincian-biaya').classList.add('hidden');
        window.renderRincianPembelianItems();
    };

    // --- HALAMAN PEMBAYARAN FINAL PEMBELIAN ---
    window.pembelianGoToPembayaran = () => {
        document.querySelectorAll('.view-panel').forEach(v => v.classList.add('hidden'));
        document.getElementById('view-pembayaran-pembelian').classList.remove('hidden');

        let subtotal = pembelianCart.reduce((s, x) => s + (x.qty * x.buyPrice), 0);
        let gTotal = subtotal + pembelianBiayaNominal; 
        document.getElementById('pembayaran-grandtotal').innerText = `Rp ${fmtRp(gTotal)}`;
        
        paymentCashAmount = gTotal; // Default uang pas untuk pembelian supplier
        
        window.renderFastCashButtons();
        window.pembelianRefreshCashDisplay();
        document.getElementById('chk-pembayaran-hutang').checked = false;
        window.pembelianToggleHutangMode(false);
    };

    window.pembelianToggleHutangMode = (isHutang) => {
        const numpad = document.getElementById('pembayaran-slider-track');
        const display = document.getElementById('pembayaran-display-cash');
        if (isHutang) {
            numpad.classList.add('opacity-30', 'pointer-events-none');
            display.innerText = "Rp 0";
            display.classList.remove('text-emerald-600');
            display.classList.add('text-gray-400');
            if(!pembelianSupplier) {
                alert("Harap pilih Supplier terlebih dahulu untuk mencatat hutang!");
                document.getElementById('chk-pembayaran-hutang').checked = false;
                window.pembelianToggleHutangMode(false);
            }
        } else {
            numpad.classList.remove('opacity-30', 'pointer-events-none');
            window.pembelianRefreshCashDisplay();
        }
    };

    window.pembelianSlideNumpad = (dir) => {
        const track = document.getElementById('pembayaran-slider-track');
        if (dir === 'right') track.style.transform = 'translateX(-50%)';
        else track.style.transform = 'translateX(0)'; 
    };

    window.pembelianNumpadInput = (char) => {
        if (char === 'C') paymentCashAmount = 0;
        else if (char === 'X') {
            let str = paymentCashAmount.toString();
            paymentCashAmount = str.length > 1 ? parseFloat(str.slice(0, -1)) : 0;
        } else {
            let str = paymentCashAmount === 0 ? '' : paymentCashAmount.toString();
            if(str.length < 12) { str += char; paymentCashAmount = parseFloat(str) || 0; }
        }
        window.pembelianRefreshCashDisplay();
    };

    window.pembelianSetCashAmount = (val) => {
        let subtotal = pembelianCart.reduce((s, x) => s + (x.qty * x.buyPrice), 0);
        let gTotal = subtotal + pembelianBiayaNominal; 
        if (val === 'pas') paymentCashAmount = gTotal;
        else paymentCashAmount = val;
        window.pembelianRefreshCashDisplay();
    };

    window.pembelianRefreshCashDisplay = () => {
        const display = document.getElementById('pembayaran-display-cash');
        const btnSubmit = document.getElementById('btn-pembayaran-submit');
        let subtotal = pembelianCart.reduce((s, x) => s + (x.qty * x.buyPrice), 0);
        let gTotal = subtotal + pembelianBiayaNominal; 

        display.innerText = `Rp ${fmtRp(paymentCashAmount)}`;
        display.classList.add('text-emerald-600');
        display.classList.remove('text-gray-400');

        if (paymentCashAmount >= gTotal && gTotal > 0) {
            btnSubmit.className = "w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center text-sm shadow-sm cursor-pointer hover:bg-emerald-600 transition";
            btnSubmit.classList.remove('pointer-events-none');
        } else {
            btnSubmit.className = "w-7 h-7 rounded-lg bg-gray-200 text-white flex items-center justify-center text-sm pointer-events-none transition";
        }
    };

    window.renderFastCashButtons = () => {
        const box = document.getElementById('pembayaran-fastcash-container');
        box.innerHTML = `<button onclick="pembelianSetCashAmount('pas')" class="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-md shadow-xs text-sm active:bg-emerald-700">Uang Pas</button>`;
        const noms = [10000, 50000, 100000, 500000, 1000000, 5000000];
        noms.forEach(nom => {
            box.innerHTML += `<button onclick="pembelianSetCashAmount(${nom})" class="w-full bg-emerald-600 text-white font-bold py-3.5 rounded-md shadow-xs text-sm active:bg-emerald-700">${fmtRp(nom)}</button>`;
        });
    };

    // --- PROSES TRANSAKSI PEMBELIAN SUPPLIER & UPDATE STOK FISIK ---
    window.pembelianSelesaiTransaksi = async () => {
        let subtotal = pembelianCart.reduce((s, x) => s + (x.qty * x.buyPrice), 0);
        let gTotal = subtotal + pembelianBiayaNominal;

        const isHutang = document.getElementById('chk-pembayaran-hutang').checked;

        if(!isHutang && paymentCashAmount < gTotal) return alert("Uang pembayaran kurang!");

        try {
            // TAMBAH STOK FISIK DI DATABASE GLOBAL window.products (JIKA BARANG PAKE STOK)
            for (let item of pembelianCart) {
                const prod = window.products.find(p => p.id === item.product.id);
                if (prod && prod.useStock !== false) {
                    // Update Harga Beli Terakhir
                    prod.buyPrice = item.buyPrice;
                    // Tambah Stok
                    prod.stock = (Number(prod.stock) || 0) + item.qty;
                    
                    // Tambahkan Batch Stok FIFO
                    if (!prod.stockBatches) prod.stockBatches = [];
                    prod.stockBatches.push({
                        dateStr: window.getFormattedCurrentDateTime().split(' ')[0].replace(/\//g, ' '),
                        fullDate: window.getFormattedCurrentDateTime(),
                        stock: item.qty,
                        buyPrice: item.buyPrice,
                        notes: "Pembelian Supplier"
                    });
                    
                    // Simpan ke Firestore jika online
                    if(window.fb && window.db && !String(prod.id).startsWith('local_')) {
                        await window.fb.updateDoc(window.fb.doc(window.db, "products", prod.id), { 
                            stock: prod.stock,
                            buyPrice: prod.buyPrice,
                            stockBatches: prod.stockBatches
                        });
                    }
                }
            }

            document.getElementById('view-pembayaran-pembelian').classList.add('hidden');
            document.getElementById('view-pembelian-success').classList.remove('hidden');
            
            document.getElementById('succ-total').innerText = `Rp ${fmtRp(gTotal)}`;
            document.getElementById('succ-paid').innerText = `Rp ${fmtRp(isHutang ? 0 : paymentCashAmount)}`;
            document.getElementById('succ-change').innerText = `Rp ${fmtRp(isHutang ? 0 : Math.max(0, paymentCashAmount - gTotal))}`;
            document.getElementById('succ-sup').innerText = pembelianSupplier ? pembelianSupplier.name : "-";
            
        } catch(e) {
            console.error("Gagal sinkronisasi transaksi:", e);
            alert("Terjadi kesalahan saat menyimpan transaksi pembelian.");
        }
    };

    window.pembelianSelesaiTutup = () => {
        pembelianCart = [];
        pembelianSupplier = null;
        pembelianBiayaNominal = 0;
        
        document.getElementById('view-pembelian-success').classList.add('hidden');
        document.getElementById('view-manajemen-hub').classList.remove('hidden');
        
        // REFRESH LAYAR AGAR STOK YANG BERTAMBAH LANGSUNG TERLIHAT
        window.renderPembelianProductList(document.getElementById('input-search-pembelian').value);
        window.updatePembelianCartCount();
    };

})();
