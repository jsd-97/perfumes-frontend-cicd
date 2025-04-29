const PERFUMES_PER_PAGE = 24;
let data;
console.log('asdasds')
let currentPage;
let currentFirstPage;
let currentLastPage;

function load() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        const jsonPerfumes = JSON.parse(this.responseText);
        data = jsonPerfumes.rawData;
        renderPagination(1);
        renderPerfumes(1);
    }
    };
    xhttp.open("GET", "https://perfumes-backend-xstz.onrender.com/", true);
    xhttp.send();
}

function renderPagination(firstPage = 1) {
  if (firstPage < 0) firstPage = 1;
  clearPages();
  const prevLink = document.querySelector('#prev');
  currentFirstPage = firstPage;
  currentLastPage = firstPage + getMaxPages(firstPage) - 1;
  let i = currentLastPage;
  while (i >= currentFirstPage) {

    if (i <= Math.floor(data.length / PERFUMES_PER_PAGE)) prevLink.insertAdjacentHTML("afterend", `<div id="page${i}" class="pagination" onclick="renderPerfumes(${i})">${i}</div>`);
    i -= 1;
  }

}

function getPerfumeHTML(rawRow) {
  const pInfo = rawRow.split(';');
  const data = `<article ><img src="${pInfo[3]}" width="240px" height="240px"></img><div class="perfumeName"><a class="perfumeNameLink" onclick="showPerfume(\`${rawRow}\`)">${pInfo[1]}</a></div><div class="perfumeBrand">${pInfo[0]}</div></article>`;
  return data;
}

function showPerfume(rawRow) {

  const getBrandCount = (brand) => {
    return data.reduce((t, p) => {
      if (p.includes(brand)) t += 1
      return t
    }, 0)
  }

  const pInfo = rawRow.split(';');
  document.getElementById('perfumes').style.display = 'none';
  document.getElementById('pagination').style.display = 'none';
  document.getElementById('perfumeView').style.display = 'block';
  document.getElementById('perfumeViewImage').src = pInfo[3]
  document.getElementById('perfumeViewDescription').textContent = pInfo[2];
  document.getElementById('perfumeViewbrandCount').textContent = `The brand ${pInfo[0]} has other ${getBrandCount(pInfo[0])} perfume(s) in this showpiece.`

  // 
}

function renderPerfumes(page = 1) {
  function updatePagination() {
    if (page == currentLastPage) {
      renderPagination(page);
      refreshPagination(page);
    }
    if (page < currentFirstPage) {
      renderPagination(currentFirstPage - (currentLastPage - currentFirstPage));
      refreshPagination(page);
    }
  }

  let elem = document.querySelector( '#perfumes' )
  elem.innerHTML = '';
  const j = page * PERFUMES_PER_PAGE;
  const perfumes = data.slice(j - PERFUMES_PER_PAGE, j);
  perfumes.forEach(perfume => {
    if (!perfume) return
    elem.innerHTML = elem.innerHTML + getPerfumeHTML(perfume);
  });
  refreshPagination(page);
  updatePagination(page);
}

const getMaxPages = (startPage = 1) => {
  const maxPages = Math.floor((document.getElementById("pagination").offsetWidth) / document.getElementById("prev").offsetWidth);
  console.log(maxPages)
  let i = maxPages - 2;
  let res = 0;
  while (i > 0) {
    const digits = (startPage + res + '').length;
    res += 1;
    i -= digits;
  }
  console.log(res)
  return res
}

function refreshPagination(newPage) {
  const elem = document.getElementById('page' + newPage);
  if (!elem) return;
  document.getElementById('page' + newPage).className = 'paginationUl';
  if (newPage !== currentPage && currentPage) document.getElementById('page' + currentPage).className = 'pagination';
  currentPage = newPage;
  if (currentPage === 1) {
    document.getElementById('prev').className = 'paginationDisabled';
  } else {
    document.getElementById('prev').className = 'pagination';
  }
  if (currentPage === Math.floor(data.length / PERFUMES_PER_PAGE)) {
    document.getElementById('next').className = 'paginationDisabled';
  } else {
    document.getElementById('next').className = 'pagination';
  }
}

function prevPage() {
  if (currentPage == 1) return;
  renderPerfumes(currentPage - 1);
}


function nextPage() {
  renderPerfumes(currentPage + 1);
}

function clearPages() {
  const elems = document.querySelectorAll('[id^="page"]');
  elems.forEach(el => el.remove())
}

function backToPage() {
  document.getElementById('perfumes').style.display = 'flex';
  document.getElementById('pagination').style.display = 'flex';
  document.getElementById('perfumeView').style.display = 'none';
}
load();
