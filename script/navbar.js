/*<header class="navbar">
        <div class="logo">
            <a href="index.html"><img src="images/quizLogo1.png" alt="logo" class="picture-header"></a>
        </div>
        <nav>
            <ul>
                <li><a href="start.html">Start</a></li>
            </ul>
        </nav>
    </header> */

const header = document.createElement("header")
header.classList.add("navbar")

const logoDiv = document.createElement("div")
logoDiv.classList.add("logo")

const logoLink = document.createElement("a")
logoLink.href = "index.html"
const logoImage = document.createElement("img")
logoImage.src = "images/quizLogo1.png"
logoImage.alt = "logo"
logoImage.classList.add("picture-header")

logoLink.appendChild(logoImage)
logoDiv.appendChild(logoLink)

const nav = document.createElement("nav")

const ul = document.createElement("ul")
const start = document.createElement("li")
const startLink = document.createElement("a")
startLink.href = "#"
startLink.textContent="Categories"
start.appendChild(startLink)

const submenu = document.createElement("ul")
submenu.classList.add("submenu")
const categoryNames = ["General Knowledge", "Film", "Music", "Celebrities", "Animal"]
for(const categoryName of categoryNames){
    const categoryLi = document.createElement("li")
    const categoryLink = document.createElement("a")
    categoryLink.href = `${categoryName.toLowerCase()}.html`
    categoryLink.textContent = categoryName
    categoryLi.appendChild(categoryLink)
    submenu.appendChild(categoryLi)
}

start.appendChild(submenu)

ul.appendChild(start)


nav.appendChild(ul)

header.appendChild(logoDiv)
header.appendChild(nav)

document.getElementById("navbar").appendChild(header)