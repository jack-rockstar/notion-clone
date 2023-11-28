import { v } from 'convex/values'
import { Doc, Id } from './_generated/dataModel'
import { mutation, query } from './_generated/server'

export const archive = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, arg) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not Authenticated')

    const userId = identity.subject

    const existingDocument = await ctx.db.get(arg.id)
    if (!existingDocument) throw new Error('Not found')

    if (existingDocument.userId !== userId) throw new Error('Unauthorized')

    const recursiveArchive = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) => (
          q
            .eq('userId', userId)
            .eq('parentDocument', documentId)
        )).collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true
        })
        await recursiveArchive(child._id)
      }
    }

    const document = await ctx.db.patch(arg.id, {
      isArchived: true
    })

    recursiveArchive(arg.id)

    return document
  }
})

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const userId = identity.subject

    const document = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) =>
        q.eq(q.field('isArchived'), true)
      ).collect()

    return document
  }
})

export const restore = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)
    if (!existingDocument) throw new Error('Not found')

    if (existingDocument.userId !== userId) throw new Error('Unauthorized')

    const recursiveRestore = async (documentId: Id<'documents'>) => {
      const children = await ctx.db
        .query('documents')
        .withIndex('by_user_parent', (q) =>
          q
            .eq('userId', userId)
            .eq('parentDocument', documentId)
        ).collect()

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: false
        })

        await recursiveRestore(child._id)
      }
    }

    const options: Partial<Doc<'documents'>> = {
      isArchived: false
    }

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument)

      if (parent?.isArchived) {
        options.parentDocument = undefined
      }
    }

    await ctx.db.patch(args.id, options)
    recursiveRestore(args.id)

    return existingDocument
  }
})

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents'))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not Authenticated')

    const userId = identity.subject

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user_parent', (q) =>
        q
          .eq('userId', userId)
          .eq('parentDocument', args.parentDocument)
      )
      .filter((q) =>
        q.eq(q.field('isArchived'), false)
      )
      .order('desc')
      .collect()

    return documents
  }
})

export const remove = mutation({
  args: {
    id: v.id('documents')
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)
    if (!existingDocument) throw new Error('Not found')

    if (existingDocument.userId !== userId) throw new Error('Unauthorized')

    const document = await ctx.db.delete(args.id)

    return document
  }
})

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents'))
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const userId = identity.subject

    const document = await ctx.db.insert('documents', {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
      urlMask: '',
      fontFamily: '',
      maxWidth: false
    })
    return document
  }

})

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error('Not authenticated')

    const userId = identity.subject

    const documents = await ctx.db
      .query('documents')
      .withIndex('by_user', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('isArchived'), false))
      .order('desc')
      .collect()

    return documents
  }
})

export const getById = query({
  args: { documentId: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()
    const document = await ctx.db.get(args.documentId)

    if (!document) return null

    if (document.isPublished && !document.isArchived) return document

    if (!identity) throw new Error('Not authenticated')

    const userId = identity.subject

    if (document.userId !== userId) throw new Error('UnAuthorized')

    return document
  }
})

export const update = mutation({
  args: {
    id: v.id('documents'),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
    urlMask: v.optional(v.string()),
    fontFamily: v.optional(v.string()),
    maxWidth: v.optional(v.boolean())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) throw new Error('Not authenticated')

    const userId = identity.subject

    const { id, ...rest } = args

    const existingDocument = await ctx.db.get(id)
    if (!existingDocument) throw new Error('Not found')

    if (existingDocument.userId !== userId) throw new Error('Unauthorized')

    const document = await ctx.db.patch(id, {
      ...rest
    })

    return document
  }
})

export const removeIcon = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) throw new Error('Not authenticated')

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)
    if (!existingDocument) throw new Error('Not found')

    if (existingDocument.userId !== userId) throw new Error('Unauthorized')

    const document = await ctx.db.patch(args.id, {
      icon: undefined
    })

    return document
  }
})
export const removeImage = mutation({
  args: { id: v.id('documents') },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) throw new Error('Not authenticated')

    const userId = identity.subject

    const existingDocument = await ctx.db.get(args.id)
    if (!existingDocument) throw new Error('Not found')

    if (existingDocument.userId !== userId) throw new Error('Unauthorized')

    const document = await ctx.db.patch(args.id, {
      coverImage: undefined
    })

    return document
  }
})

export const getByUrlMask = query({
  args: { urlMask: v.string() },
  handler: async (ctx, args) => {
    const document = await ctx.db
      .query('documents')
      .filter((q) =>
        q.eq(q.field('urlMask'), args.urlMask)
      ).unique()

    if (!document) return null

    if (document.isPublished && !document.isArchived) return document

    return document
  }
})

export const publish = mutation({
  args: {
    id: v.id('documents'),
    isPublished: v.optional(v.boolean()),
    urlMask: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity()

    if (!identity) {
      return {
        code: 401,
        status: false,
        message: 'UnAuthorized'
      }
    }

    const userId = identity.subject

    const { id, ...rest } = args

    const existingDocument = await ctx.db.get(id)
    if (!existingDocument) {
      return {
        code: 404,
        status: false,
        message: 'Not found'
      }
    }

    if (existingDocument.userId !== userId) {
      return {
        code: 401,
        status: false,
        message: 'UnAuthorized'
      }
    }

    const existsMask = await ctx.db
      .query('documents')
      .filter((q) =>
        q.eq(q.field('urlMask'), rest.urlMask)
      ).unique()

    if (existsMask) {
      return {
        code: 409,
        status: false,
        message: 'Mask existing'
      }
    }
    await ctx.db.patch(id, {
      ...rest
    })

    return {
      code: 200,
      status: true,
      message: 'correct operation'
    }
  }
})
