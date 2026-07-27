package com.saarhaber.supernova.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class BooksRepositoryHelpersTest {

    @Test
    fun `bare isbn13 is detected`() {
        assertTrue("9780316769488".looksLikeIsbn())
        assertTrue("978-0-316-76948-8".looksLikeIsbn())
    }

    @Test
    fun `isbn10 with check X is detected`() {
        assertTrue("097522980X".looksLikeIsbn())
    }

    @Test
    fun `isbn normalization keeps the X check digit`() {
        assertEquals("097522980X", "0-9752298-0-x".normalizeIsbn())
        assertEquals("9780316769488", "978-0-316-76948-8".normalizeIsbn())
    }

    @Test
    fun `free text is not an isbn`() {
        assertFalse("the catcher in the rye".looksLikeIsbn())
        assertFalse("1984".looksLikeIsbn())
    }

    @Test
    fun `http image links are upgraded to https`() {
        assertEquals(
            "https://books.google.com/cover.jpg",
            "http://books.google.com/cover.jpg".forceHttps(),
        )
        assertEquals(null, (null as String?).forceHttps())
    }

    @Test
    fun `all-caps nyt titles are title-cased`() {
        assertEquals("The Midnight Library", "THE MIDNIGHT LIBRARY".titlecase())
    }
}
