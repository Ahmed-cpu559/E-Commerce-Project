export class ApiFeature {   
    constructor(mongooseQuery, urlQuery) {
        this.mongooseQuery = mongooseQuery;
        this.urlQuery = urlQuery;
        this.responseDetails = {};  // Initialize an empty response object
    }   
     
    pagination() {
        const page = this.urlQuery.page * 1 || 1;
        const limit = this.urlQuery.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.mongooseQuery = this.mongooseQuery
            .skip(skip)
            .limit(limit);

        // Update responseDetails with pagination info
        this.responseDetails.page = page;
        this.responseDetails.limit = limit;
        this.responseDetails.skip = skip;

        return this; 
    }

    filter() {
        let filters = structuredClone(this.urlQuery);
        filters = JSON.stringify(filters);
        filters = filters.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        filters = JSON.parse(filters);
    
        let excludedFields = ['page', 'limit', 'fields', 'sort', 'search'];
        excludedFields.forEach(value => delete filters[value]);
    
        this.mongooseQuery.find(filters);

        // Update responseDetails with filters applied
        this.responseDetails.filters = filters;

        return this;
    }

    sort() {
        if (this.urlQuery.sort) {
            const sortBy = this.urlQuery.sort.split(',').join(' ');
            this.mongooseQuery.sort(sortBy);

            // Update responseDetails with sorting info
            this.responseDetails.sortedBy = sortBy;
        }
        return this;
    }

    select() {
        if (this.urlQuery.fields) {
            const selectionBy = this.urlQuery.fields.split(',').join(' ');
            this.mongooseQuery.select(selectionBy);

            // Update responseDetails with selected fields
            this.responseDetails.selectedBy = selectionBy;
        }

        return this;
    }

    search() {
        let search = this.urlQuery.search;
        if (search) {
            search = search.split(',').join(' ');
            this.mongooseQuery.find({ title: { $regex: search, $options: 'i' } });

            // Update responseDetails with search query
            this.responseDetails.searchedBy = search;
        }
        return this;
    }

    // Method to return the response details
    getResponseDetails() {
        return this.responseDetails;
    }
}


